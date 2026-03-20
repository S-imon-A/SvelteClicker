import achievements_data from "$lib/data/achievements.json"

import { data, type AchievementData, type UserData } from "$lib/utils/game_state"

export interface Achievement {
    name: string,
    desc: string,
    reqType: string,
    reqAmount: number,
    image: string,
    boostType: string,
    boostAmount: number,
    boostText: string
}

export interface AchievementObject {
    achievement: Achievement,
    data: AchievementData
}

let currentUserDataState: UserData

function getAchievemenent(achData: any): Achievement {
    const achievement: Achievement = {
        name: achData.name,
        desc: achData.desc,
        reqType: achData.req_type,
        reqAmount: achData.req_amount,
        image: achData.image,
        boostType: achData.boost_type,
        boostAmount: achData.boost_amount,
        boostText: achData.boost_text
    }

    return achievement
}

export function getAchievemenents(): Array<Achievement> {
    let achievements: Array<Achievement> = []

    for (const achievement of achievements_data.achievements) {
        achievements.push(getAchievemenent(achievement))
    }

    return achievements
}

function getAchievementObject(achievement: Achievement): AchievementObject {
    let savedAchievement: AchievementData | null = getSavedAchievement(achievement.name)

    if (!savedAchievement) {
        savedAchievement = {
            name: achievement.name,
            progress: 0,
            completed: false
        }

        data.update(state => {
            state.achievements.push(savedAchievement!)

            return state
        })
    }

    const achievementObject: AchievementObject = {
        achievement: achievement,
        data: savedAchievement
    }

    return achievementObject
}

function getSavedAchievement(achName: string): AchievementData | null {
    for (const achievementData of currentUserDataState.achievements) {
        if (achievementData.name !== achName) continue

        return achievementData
    }

    return null
}

export function getAchievementObjects(achievements: Array<Achievement>): Array<AchievementObject> {
    let achievementObjects: Array<AchievementObject> = []

    for (const achievement of achievements) {
        achievementObjects.push(getAchievementObject(achievement))
    }

    return achievementObjects
}

export function resolveAchievements(): Array<AchievementObject> {
    const achievements: Array<Achievement> = getAchievemenents()
    const achievementObjects: Array<AchievementObject> = getAchievementObjects(achievements)

    return achievementObjects
}

export function handleAchievementProgress(state: UserData, achievements: Array<AchievementObject>): void {
    for (const achievement of achievements) {
        const type: string = achievement.achievement.reqType

        switch (type) {
            case "tree_destroy":
                achievement.data.progress = state.achievementTracking.treesRemoved 

                break
            case "leaf_collect":
                achievement.data.progress = state.achievementTracking.leavesCollected

                break
            case "prestige":
                achievement.data.progress = state.achievementTracking.totalPrestiges

                break
            case "items":
                achievement.data.progress = state.achievementTracking.itemsCollected

                break
            case "acorns":
                achievement.data.progress = state.achievementTracking.acornsCollected

                break
            case "level":
                achievement.data.progress = state.achievementTracking.levelsGained

                break
            case "collectibles":
                achievement.data.progress = state.collectibles.length

                break
            case "time":
                achievement.data.progress = state.playtime

                break
            case "max_level":
                achievement.data.progress = state.achievementTracking.toplevel

                break
            case "tree_click":
                achievement.data.progress = state.achievementTracking.treeTaps

                break
            case "leaf":
                achievement.data.progress = state.achievementTracking.achievementsCompleted

                break
        }

        if (achievement.data.progress > achievement.achievement.reqAmount) achievement.data.progress = achievement.achievement.reqAmount

        if (achievement.data.progress >= achievement.achievement.reqAmount && !achievement.data.completed) {
            achievement.data.completed = true

            state.achievementTracking.achievementsCompleted++

            data.update(_state => {
                for (const _ach of _state.achievements) {
                    if (_ach.name !== achievement.data.name) continue

                    _ach.progress = achievement.data.progress
                    _ach.completed = true

                    break
                }

                switch (achievement.achievement.boostType) {
                    case "click_strength":
                        _state.achievementBuffs.clickPower += achievement.achievement.boostAmount

                        break
                    case "passive_click_strength":
                        _state.achievementBuffs.passiveClickPower += achievement.achievement.boostAmount

                        break
                    case "leaf_cost":
                        _state.achievementBuffs.leafCostAdd += achievement.achievement.boostAmount

                        break
                    case "passive_click_multi":
                        _state.achievementBuffs.passiveClickMulti += achievement.achievement.boostAmount

                        break
                    case "active_click_multi":
                        _state.achievementBuffs.clickMulti += achievement.achievement.boostAmount

                        break
                    case "xp_multi":
                        _state.achievementBuffs.xpMulti += achievement.achievement.boostAmount

                        break
                    case "crit_multi":
                        _state.achievementBuffs.critMulti += achievement.achievement.boostAmount

                        break
                }

                return _state
            })
        }
    }
}

function setup(): void {
    data.subscribe(state => {
        currentUserDataState = state
    })
}

setup()