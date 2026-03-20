import upgrades_data from "$lib/data/upgrades_data.json"

import { abbrNumber } from "$lib/utils/abbr"
import { data, type UserData, type Upgrade } from "$lib/utils/game_state"

export interface UpgradeData {
    name: string,
    image: string,
    price: Array<number>,
    boost: number,
    type: string,
    category: number
}

export interface UpgradeObject {
    upgradeData: UpgradeData,
    data: Upgrade
}

let currentUserDataState: UserData

function parseUpgrade(storedUpgrade: any): UpgradeData {
    return {
        name: storedUpgrade.name,
        image: storedUpgrade.image,
        price: storedUpgrade.price,
        boost: storedUpgrade.boost,
        type: storedUpgrade.type,
        category: storedUpgrade.category
    }
}

function getCategoryUpgrades(category: number): Array<UpgradeData> {
    let upgrades: Array<UpgradeData> = []

    for (const upgrade of upgrades_data.upgrades) {
        if (upgrade.category !== category) continue

        upgrades.push(parseUpgrade(upgrade))
    }

    return upgrades
}

function getAllUpgrades(): Array<UpgradeData> {
    let upgrades: Array<UpgradeData> = []

    for (const upgrade of upgrades_data.upgrades) {
        upgrades.push(parseUpgrade(upgrade))
    }

    return upgrades
}

export function getUpgrades(category?: number): Array<UpgradeData> {
    if (!category && category !== 0) return getAllUpgrades()

    return getCategoryUpgrades(category)
}

function parseUpgradeData(upgrade: UpgradeData): UpgradeObject {
    const upgradeData: Upgrade = {
        name: upgrade.name,
        count: 0
    }

    const upgradeObject: UpgradeObject = {
        upgradeData: upgrade,
        data: upgradeData
    }

    const ownedUpgrade: Upgrade | null = getOwnedUpgrade(currentUserDataState.upgrades, upgradeData)

    if (ownedUpgrade) {
        upgradeObject.data = ownedUpgrade
    }

    return upgradeObject
}

export function parseUpgradesData(upgrades: Array<UpgradeData>): Array<UpgradeObject> {
    let upgradeObjects: Array<UpgradeObject> = []

    for (const upgrade of upgrades) {
        const upgradeObject: UpgradeObject = parseUpgradeData(upgrade)

        upgradeObjects.push(upgradeObject)
    }

    return upgradeObjects
}

export function resolveUpgrades(category?: number): Array<UpgradeObject> {
    const upgradesData: Array<UpgradeData> = getUpgrades(category)
    const upgradeObjects: Array<UpgradeObject> = parseUpgradesData(upgradesData)

    return upgradeObjects
}

export function getUpgradePrice(upgrade: UpgradeObject): number {
    let megaUpgrade: number = 1

    if (upgrade.data.count >= 100) {
        megaUpgrade = 1_000
    }
    
    if (upgrade.data.count >= 400) {
        megaUpgrade = 500_000_000
    }

    if (upgrade.data.count >= upgrade.upgradeData.price.length) return upgrade.upgradeData.price[upgrade.upgradeData.price.length - 1] * megaUpgrade

    return upgrade.upgradeData.price[upgrade.data.count] * megaUpgrade
}

function getOwnedUpgrade(upgrades: Array<Upgrade>, upgrade: Upgrade): Upgrade | null {
    for (const _upgrade of upgrades) {
        if (_upgrade.name !== upgrade.name) continue

        return _upgrade
    }

    return null
}

export function buyUpgrade(upgrade: UpgradeObject): void {
    const price: number = getUpgradePrice(upgrade)

    if (currentUserDataState.coins < price) return

    data.update(state => {
        state.coins -= price

        upgrade.data.count += 1

        let ownedUpgrade: Upgrade | null = getOwnedUpgrade(state.upgrades, upgrade.data)

        if (!ownedUpgrade) {
            state.upgrades.push(upgrade.data)
        }

        for (const _upgrade of state.upgrades) {
            if (_upgrade.name !== upgrade.upgradeData.name) continue

            _upgrade.count = upgrade.data.count

            break
        }

        let megaUpgrade: number = 1

        if (ownedUpgrade) {
            if (ownedUpgrade.count > 100) {
                if (ownedUpgrade.count > 400) {
                    megaUpgrade = 1_000_000
                }
                else {
                    megaUpgrade = 1_000
                }
            }
        }

        switch (upgrade.upgradeData.type) {
            case "click_strength":
                state.clickPower += upgrade.upgradeData.boost * megaUpgrade

                break
            case "click_power":
                state.clickMulti += upgrade.upgradeData.boost * megaUpgrade

                break
            case "xp_extra":
                state.xpExtra += upgrade.upgradeData.boost * megaUpgrade

                break
            case "xp_multi":
                state.xpMulti += upgrade.upgradeData.boost * megaUpgrade

                break
            case "passive_strength":
                state.passiveClickPower += upgrade.upgradeData.boost * megaUpgrade

                break
            case "passive_power":
                state.passiveClickMulti += upgrade.upgradeData.boost * megaUpgrade

                break
            case "passive_speed":
                state.passiveClickSpeed /= upgrade.upgradeData.boost * megaUpgrade

                break
            case "crit_chance":
                state.criticalHitChance += upgrade.upgradeData.boost * megaUpgrade

                break
            case "crit_power":
                state.criticalHitPower += upgrade.upgradeData.boost * megaUpgrade

                break
            case "leaf_extra_cost":
                state.tree.currentLeafCost += upgrade.upgradeData.boost * megaUpgrade

                break
            case "leaf_cost_multi":
                state.tree.currentLeafMulti += upgrade.upgradeData.boost * megaUpgrade

                break
        }

        return state
    })
}

export function getUpgradeBoostText(upgrade: UpgradeObject): string {
    let upgradeBoostText: string = ""

    switch (upgrade.upgradeData.type) {
        case "click_strength":
                upgradeBoostText = `+${abbrNumber(currentUserDataState.clickPower)} click strength`

                break
            case "click_power":
                upgradeBoostText = `x${abbrNumber(currentUserDataState.clickMulti)} click power`

                break
            case "xp_extra":
                upgradeBoostText = `+${abbrNumber(currentUserDataState.xpExtra)} xp per tree`

                break
            case "xp_multi":
                upgradeBoostText = `x${abbrNumber(currentUserDataState.xpMulti)} xp per tree`

                break
            case "passive_strength":
                upgradeBoostText = `+${abbrNumber(currentUserDataState.passiveClickPower)} passive click strength`

                break
            case "passive_power":
                upgradeBoostText = `x${abbrNumber(currentUserDataState.passiveClickMulti)} passive click power`

                break
            case "passive_speed":
                upgradeBoostText = `Click per ${Math.round(currentUserDataState.passiveClickSpeed * 10_000)/10_000} miliseconds`

                break
            case "crit_chance":
                upgradeBoostText = `${abbrNumber(currentUserDataState.criticalHitChance)}% for critical hits`

                break
            case "crit_power":
                upgradeBoostText = `x${abbrNumber(currentUserDataState.criticalHitPower)} critical hit power`

                break
            case "leaf_extra_cost":
                upgradeBoostText = `+${abbrNumber(currentUserDataState.tree.currentLeafCost)} leaf cost`

                break
            case "leaf_cost_multi":
                upgradeBoostText = `x${abbrNumber(currentUserDataState.tree.currentLeafMulti)} leaf cost`

                break
    }

    return upgradeBoostText
}

function setup(): void {
    data.subscribe(state => {
        currentUserDataState = state
    })
}

setup()