import { browser } from "$app/environment"
import { writable, type Writable } from "svelte/store"
import { SAVE_KEY } from "$lib/constants/game"

export interface TreeUpgrade {
    id: number,
    dropRate: number,
    healthReduce: number,
    healthReduceMulti: number,
    leafCost: number,
    leafCostMulti: number
}

export interface TreeData {
    id: number,
    currentHealth: number,
    leaves: Array<any>,
    collectedLeaves: Array<any>,
    upgrades: Array<TreeUpgrade>,
    currentLeafCost: number,
    currentLeafMulti: number,
    ownedTrees: Array<number>
}

export interface Upgrade {
    name: string,
    count: number
}

export interface SkillUpgrade {
    name: string,
    unlocked: boolean,
    owned: boolean
}

export interface PrestigeBuffs {
    clickMulti: number,
    passiveClickMulti: number,
    fasterPassiveClicks: number,
    leafCostMulti: number,
    leafSizeMulti: number,
    leafExtraCount: number,
    xpMulti: number,
    starterCritChance: number,
    critMulti: number
}

export interface CollectibleBuffs {
    critChance: number,
    clickStrength: number,
    extraXP: number,
    passiveClickMulti: number,
    clickMulti: number,
    critMulti: number,
    fasterPassiveClicks: number,
    xpMulti: number,
    dropChance: number
}

export interface AchievementData {
    name: string,
    progress: number,
    completed: boolean
}

export interface AchievementBuffs {
    clickPower: number,
    passiveClickPower: number,
    leafCostAdd: number,
    clickMulti: number,
    passiveClickMulti: number,
    xpMulti: number,
    critMulti: number
}

export interface AchievementTracking {
    treesRemoved: number,
    leavesCollected: number,
    totalPrestiges: number,
    itemsCollected: number,
    acornsCollected: number,
    levelsGained: number,
    toplevel: number,
    treeTaps: number,
    achievementsCompleted: number
}

export interface UserData {
    coins: number,
    clickPower: number,
    passiveClickPower: number,
    clickMulti: number,
    passiveClickMulti: number,
    criticalHitChance: number,
    criticalHitPower: number,
    tree: TreeData,
    upgrades: Array<Upgrade>,
    collectibles: Array<string>,
    skillTokens: number,
    skillTreeUpgrades: Array<SkillUpgrade>,
    playtime: number,
    level: number,
    xp: number,
    xpExtra: number,
    xpMulti: number,
    passiveClickSpeed: number,
    prestigeBuffs: PrestigeBuffs,
    canPrestige: boolean,
    runSkillTokens: number,
    collectibleBuffs: CollectibleBuffs,
    achievements: Array<AchievementData>,
    achievementBuffs: AchievementBuffs,
    achievementTracking: AchievementTracking
}

export interface TransferData {
    toDropItems: Array<string>
}

export const transferData: TransferData = {
    toDropItems: []
}

export const data: Writable<UserData> = writable<UserData>({
    coins: 0,
    clickPower: 0,
    passiveClickPower: 0,
    clickMulti: 1,
    passiveClickMulti: 1,
    criticalHitChance: 0,
    criticalHitPower: 1,
    tree: {
        id: 0,
        currentHealth: 0,
        leaves: [],
        collectedLeaves: [],
        upgrades: [],
        currentLeafCost: 0,
        currentLeafMulti: 1,
        ownedTrees: [0]
    },
    upgrades: [],
    collectibles: [],
    skillTokens: 0,
    skillTreeUpgrades: [],
    playtime: 0,
    level: 1,
    xp: 0,
    xpExtra: 0,
    xpMulti: 1,
    passiveClickSpeed: 1_000,
    prestigeBuffs: {
        clickMulti: 1,
        passiveClickMulti: 1,
        fasterPassiveClicks: 1,
        leafCostMulti: 1,
        leafSizeMulti: 1,
        leafExtraCount: 0,
        xpMulti: 1,
        starterCritChance: 0,
        critMulti: 1
    },
    canPrestige: false,
    runSkillTokens: 0,
    collectibleBuffs: {
        critChance: 0,
        clickStrength: 1,
        extraXP: 0,
        passiveClickMulti: 1,
        clickMulti: 1,
        critMulti: 1,
        fasterPassiveClicks: 1,
        xpMulti: 1,
        dropChance: 1
    },
    achievements: [],
    achievementBuffs: {
        clickPower: 0,
        passiveClickPower: 0,
        leafCostAdd: 0,
        clickMulti: 1,
        passiveClickMulti: 1,
        xpMulti: 1,
        critMulti: 1
    },
    achievementTracking: {
        treesRemoved: 0,
        leavesCollected: 0,
        totalPrestiges: 0,
        itemsCollected: 0,
        acornsCollected: 0,
        levelsGained: 0,
        toplevel: 0,
        treeTaps: 0,
        achievementsCompleted: 0
    }
})

export function loadUserData(): void {
    if (!browser) return

    const stored: string | null = localStorage.getItem(SAVE_KEY)

    if (!stored) return

    const loadedData: UserData = JSON.parse(stored)

    if (!loadedData) return

    data.set(loadedData)
}

let currentState: UserData
export function saveUserData(): void {
    if (!browser) return

    data.subscribe(state => {
        currentState = state
    })
}
setInterval(() => {
    if (!currentState) return

    localStorage.setItem(SAVE_KEY, JSON.stringify(currentState))
}, 5_000)