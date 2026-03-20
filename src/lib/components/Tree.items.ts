import item_data from "$lib/data/item_data.json"
import collectibles from "$lib/data/collectibles.json"

import { getRandomInt } from "$lib/utils/math"
import type { LeafObject } from "./Tree.leaves"
import { ITEM_DROP_CHANCE_RANGE } from "$lib/constants/game"
import { data, type UserData } from "$lib/utils/game_state"
import { getCollectibles, type CollectibleData } from "./Collectibles.collectibles"

export interface SpecialItem {
    image: string,
    chance: number,
    type: string,
    name: string,
    size: number,
    popupColor: string
}

let currentUserDataState: UserData

function createItem(itemData: any): SpecialItem {
    const item: SpecialItem = {
        image: itemData.image,
        chance: itemData.chance,
        type: itemData.type,
        name: itemData.name,
        size: itemData.size,
        popupColor: itemData.popup_color
    }

    return item
}

export function getItems(): Array<SpecialItem> {
    let items: Array<SpecialItem> = []

    for (const item of item_data.items) {
        items.push(createItem(item))
    }

    return items
}

function applyDropChanceBoost(items: Array<SpecialItem>, boost: number): Array<SpecialItem> {
    const newItems: Array<SpecialItem> = JSON.parse(JSON.stringify(items))

    for (const newItem of newItems) {
        newItem.chance *= boost
    }

    return newItems
}

export function runItemDropChance(items: Array<SpecialItem>): SpecialItem | null {
    let totalItemChance: number = 0

    const usedItems: Array<SpecialItem> = applyDropChanceBoost(items, currentUserDataState.collectibleBuffs.dropChance)

    for (const item of usedItems) {
        totalItemChance += item.chance
    }

    let rn: number = getRandomInt(0, ITEM_DROP_CHANCE_RANGE)
    let currentItemChance: number = 0

    let pickedItem: SpecialItem | null = null

    for (let i = 0; i < usedItems.length; i++) {
        const item = usedItems[i]

        if (rn >= currentItemChance && rn < currentItemChance + item.chance) {
            pickedItem = item

            break
        }

        currentItemChance += item.chance
    }

    return pickedItem
}

export function isLeafItem(leaf: LeafObject, items: Array<SpecialItem>): boolean {
    for (const item of items) {
        if (item.image != leaf.image) continue

        return true
    }

    return false
}

export function getItemData(itemImage: string): SpecialItem | null {
    const items: Array<SpecialItem> = getItems()

    for (const item of items) {
        if (item.image !== itemImage) continue

        return item
    }

    return null
}

export function getItemDataByName(itemName: string): SpecialItem | null {
    const items: Array<SpecialItem> = getItems()

    for (const item of items) {
        if (item.name !== itemName) continue

        return item
    }

    return null
}

export function getItemDropChanceString(itemName: string): string {
    const items: Array<SpecialItem> = getItems()

    for (const item of items) {
        if (item.name !== itemName) continue

        let chance: string = (item.chance / ITEM_DROP_CHANCE_RANGE * 100 * currentUserDataState.collectibleBuffs.dropChance).toString() + "%"

        return chance
    }

    return ""
}

function getCollectibleData(itemName: string): CollectibleData | null {
    const collectibleDatas: Array<CollectibleData> = getCollectibles()

    for (const collectibleData of collectibleDatas) {
        if (collectibleData.name !== itemName) continue

        return collectibleData
    }

    return null
}

export function onItemCollect(item: SpecialItem): void {
    data.update(state => {
        state.achievementTracking.itemsCollected++

        if (item.type === "collectible") {
            if (state.collectibles.includes(item.name)) {
                state.runSkillTokens += 4
            }
            else {
                state.collectibles.push(item.name)

                const collectibleData: CollectibleData | null = getCollectibleData(item.name)

                if (collectibleData) {
                    switch (collectibleData.type) {
                        case "crit_chance":
                            state.collectibleBuffs.critChance = collectibleData.boost

                            break
                        case "click_strength":
                            state.collectibleBuffs.clickStrength = collectibleData.boost

                            break
                        case "extra_xp":
                            state.collectibleBuffs.extraXP = collectibleData.boost

                            break
                        case "passive_click_boost":
                            state.collectibleBuffs.passiveClickMulti = collectibleData.boost

                            break
                        case "click_boost":
                            state.collectibleBuffs.clickMulti = collectibleData.boost

                            break
                        case "crit_power":
                            state.collectibleBuffs.critMulti = collectibleData.boost

                            break
                        case "passive_click_speed":
                            state.collectibleBuffs.fasterPassiveClicks = collectibleData.boost

                            break
                        case "xp_boost":
                            state.collectibleBuffs.xpMulti = collectibleData.boost

                            break
                        case "drop_chance":
                            state.collectibleBuffs.dropChance = collectibleData.boost

                            break
                    }
                }
            }
        }
        else {
            switch (item.name) {
                case "Acorn":
                    if (state.canPrestige) {
                        state.runSkillTokens += 2
                    }
                    else {
                        state.canPrestige = true
                    }

                    state.achievementTracking.acornsCollected++

                    break
            }
        }

        return state
    })
}

function setup(): void {
    data.subscribe(state => {
        currentUserDataState = state
    })
}

setup()