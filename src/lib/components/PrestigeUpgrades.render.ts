import prestige_upgrades from "$lib/data/prestige_upgrades_data.json"

import { data, type UserData, type SkillUpgrade } from "$lib/utils/game_state"

export interface PrestigeUpgrade {
    name: string,
    cost: number,
    image: string,
    desc: string,
    boost: number,
    type: string
}

export interface PrestigeUpgradeObject {
    upgrade: PrestigeUpgrade,
    data: SkillUpgrade
}

export interface PrestigeUpgradeCategory {
    name: string,
    content: Array<Array<PrestigeUpgrade>>,
    data: Array<Array<PrestigeUpgradeObject>>
}

let currentUserDataState: UserData

function parsePrestigeUpgrade(columnUpgrade: any): PrestigeUpgrade {
    const prestigeUpgrade: PrestigeUpgrade = {
        name: columnUpgrade.name,
        cost: columnUpgrade.cost,
        image: columnUpgrade.image,
        desc: columnUpgrade.boost_text,
        boost: columnUpgrade.boost,
        type: columnUpgrade.type
    }

    return prestigeUpgrade
}

function parsePrestigeUpgrades(column: any): Array<PrestigeUpgrade> {
    let prestigeUpgrades: Array<PrestigeUpgrade> = []

    for (const columnUpgrade of column) {
        prestigeUpgrades.push(parsePrestigeUpgrade(columnUpgrade))
    }

    return prestigeUpgrades
}

function getPrestigeUpgradeCategory(key: string, name: string): PrestigeUpgradeCategory {
    const columns: any = prestige_upgrades.prestige_upgrades[key as keyof typeof prestige_upgrades.prestige_upgrades]

    let content: Array<Array<PrestigeUpgrade>> = []

    for (const column of columns) {
        content.push(parsePrestigeUpgrades(column))
    }

    const prestigeUpgradeCategory: PrestigeUpgradeCategory = {
        name: name,
        content: content,
        data: []
    }

    return prestigeUpgradeCategory
}

export function getPrestigeUpgradeCategories(): Array<PrestigeUpgradeCategory> {
    let categories: Array<PrestigeUpgradeCategory> = []

    for (const prestigeKey of prestige_upgrades.prestige_keys) {
        categories.push(getPrestigeUpgradeCategory(prestigeKey.key, prestigeKey.category_name))
    }

    return categories
}

function getOwnedUpgrade(upgrades: Array<SkillUpgrade>, upgrade: SkillUpgrade): SkillUpgrade | null {
    for (const _upgrade of upgrades) {
        if (_upgrade.name !== upgrade.name) continue

        return _upgrade
    }

    return null
}

function createPrestigeUpgradeObject(prestigeUpgrade: PrestigeUpgrade, index: number): PrestigeUpgradeObject {
    const skillUpgrade: SkillUpgrade = {
        name: prestigeUpgrade.name,
        unlocked: false,
        owned: false
    }

    const prestigeUpgradeObject: PrestigeUpgradeObject = {
        upgrade: prestigeUpgrade,
        data: skillUpgrade
    }

    const ownedSkillUpgrade: SkillUpgrade | null = getOwnedUpgrade(currentUserDataState.skillTreeUpgrades, skillUpgrade)
    
    if (ownedSkillUpgrade) {
        prestigeUpgradeObject.data = ownedSkillUpgrade
    }

    if (index === 0) {
        skillUpgrade.unlocked = true
    }

    return prestigeUpgradeObject
}

function setLastOwnedPrestigeUpgradeUnlock(dataColumn: Array<PrestigeUpgradeObject>): void {
    let lastOwnedIndex: number = -1
    
    for (let i = 0; i < dataColumn.length; i++) {
        const upgrade = dataColumn[i]

        if (upgrade.data.owned) continue

        lastOwnedIndex = i - 1

        upgrade.data.unlocked = true

        break
    }
}

function createPrestigeUpgradeCategoryObject(prestigeUpgradeCategory: PrestigeUpgradeCategory): PrestigeUpgradeCategory {
    let dataColumns: Array<Array<PrestigeUpgradeObject>> = []

    for (const column of prestigeUpgradeCategory.content) {
        let dataColumn: Array<PrestigeUpgradeObject> = []

        for (let i = 0; i < column.length; i++) {
            const upgrade = column[i]

            dataColumn.push(createPrestigeUpgradeObject(upgrade, i))
        }

        setLastOwnedPrestigeUpgradeUnlock(dataColumn)

        dataColumns.push(dataColumn)
    }

    prestigeUpgradeCategory.data = dataColumns

    return prestigeUpgradeCategory
}

export function createPrestigeUpgradeCategoryObjects(prestigeUpgradeCategories: Array<PrestigeUpgradeCategory>): Array<PrestigeUpgradeCategory> {
    let prestigeUpgradeCategoryObjects: Array<PrestigeUpgradeCategory> = []

    for (const prestigeUpgradeCategory of prestigeUpgradeCategories) {
        prestigeUpgradeCategoryObjects.push(createPrestigeUpgradeCategoryObject(prestigeUpgradeCategory))
    }

    return prestigeUpgradeCategoryObjects
}

export function resolvePrestigeUpgrades(): Array<PrestigeUpgradeCategory> {
    const prestigeUpgradeCategories: Array<PrestigeUpgradeCategory> = getPrestigeUpgradeCategories()
    const prestigeUpgradeCategoryObjects: Array<PrestigeUpgradeCategory> = createPrestigeUpgradeCategoryObjects(prestigeUpgradeCategories)

    return prestigeUpgradeCategoryObjects
}

export function buyPrestigeUpgrade(prestigeUpgradeObject: PrestigeUpgradeObject): void {
    if (currentUserDataState.skillTokens < prestigeUpgradeObject.upgrade.cost) return

    data.update(state => {
        state.skillTokens -= prestigeUpgradeObject.upgrade.cost

        let ownedSkillUpgrade: SkillUpgrade | null = getOwnedUpgrade(state.skillTreeUpgrades, prestigeUpgradeObject.data)
        
        if (!ownedSkillUpgrade) {
            prestigeUpgradeObject.data.owned = true

            state.skillTreeUpgrades.push(prestigeUpgradeObject.data)
        }
        
        for (const skillUpgrade of state.skillTreeUpgrades) {
            if (skillUpgrade.name !== prestigeUpgradeObject.upgrade.name) continue
        
            skillUpgrade.owned = true
        
            break
        }

        switch (prestigeUpgradeObject.upgrade.type) {
            case "click_boost":
                state.prestigeBuffs.clickMulti = prestigeUpgradeObject.upgrade.boost

                break
            case "passive_click_boost":
                state.prestigeBuffs.passiveClickMulti = prestigeUpgradeObject.upgrade.boost

                break
            case "passive_click_timer":
                state.prestigeBuffs.fasterPassiveClicks = prestigeUpgradeObject.upgrade.boost

                break
            case "leaf_cost":
                state.prestigeBuffs.leafCostMulti = prestigeUpgradeObject.upgrade.boost

                break
            case "leaf_size":
                state.prestigeBuffs.leafSizeMulti = prestigeUpgradeObject.upgrade.boost

                break
            case "leaf_amount":
                state.prestigeBuffs.leafExtraCount = prestigeUpgradeObject.upgrade.boost

                break
            case "xp_boost":
                state.prestigeBuffs.xpMulti = prestigeUpgradeObject.upgrade.boost

                break
            case "crit_chance":
                state.prestigeBuffs.starterCritChance = prestigeUpgradeObject.upgrade.boost

                break
            case "crit_power":
                state.prestigeBuffs.critMulti = prestigeUpgradeObject.upgrade.boost

                break
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