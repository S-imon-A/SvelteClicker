import collectibles from "$lib/data/collectibles.json"
import items from "$lib/data/item_data.json"

import { ITEM_DROP_CHANCE_RANGE } from "$lib/constants/game"
import { data, type UserData } from "$lib/utils/game_state"

export interface CollectibleData {
    name: string,
    desc: string,
    boostText: string,
    boost: number,
    type: string,
    dropChance: number,
    image: string
}

export interface CollectableObject {
    collectibleData: CollectibleData,
    owned: boolean
}

let currentUserDataState: UserData

function getCollectibleDropChance(collectibleName: string): number {
    for (const dropItem of items.items) {
        if (dropItem.name !== collectibleName) continue

        return (dropItem.chance / ITEM_DROP_CHANCE_RANGE) * currentUserDataState.collectibleBuffs.dropChance * 100
    }

    return 0
}

function getCollectibleImage(collectibleName: string): string {
    for (const dropItem of items.items) {
        if (dropItem.name !== collectibleName) continue

        return dropItem.image
    }

    return ""
}

function getCollectibleData(collectible: any): CollectibleData {
    const collectibleData: CollectibleData = {
        name: collectible.name,
        desc: collectible.desc,
        boostText: collectible.boost_text,
        boost: collectible.boost,
        type: collectible.type,
        dropChance: getCollectibleDropChance(collectible.name),
        image: getCollectibleImage(collectible.name)
    }

    return collectibleData
}

export function getCollectibles(): Array<CollectibleData> {
    let collectibleDatas: Array<CollectibleData> = []

    for (const collectible of collectibles.collectibles) {
        collectibleDatas.push(getCollectibleData(collectible))
    }

    return collectibleDatas
}

function getCollectibleObject(collectibleData: CollectibleData): CollectableObject {
    const isOwned: boolean = currentUserDataState.collectibles.includes(collectibleData.name)

    const collectibleObject: CollectableObject = {
        collectibleData: collectibleData,
        owned: isOwned
    }

    return collectibleObject
}

export function getCollectibleObjects(collectibleDatas: Array<CollectibleData>): Array<CollectableObject> {
    let collectibleObjects: Array<CollectableObject> = []

    for (const collectibleData of collectibleDatas) {
        collectibleObjects.push(getCollectibleObject(collectibleData))
    }

    return collectibleObjects
}

export function resolveCollectibles(): Array<CollectableObject> {
    const collectibleDatas: Array<CollectibleData> = getCollectibles()
    const collectibleObjects: Array<CollectableObject> = getCollectibleObjects(collectibleDatas)

    return collectibleObjects
}

function setup(): void {
    data.subscribe(state => {
        currentUserDataState = state
    })
}

setup()