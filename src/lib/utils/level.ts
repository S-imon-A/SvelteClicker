import level_data from "$lib/data/level_data.json"

export function getNextLevelXPNeeded(level: number): number {
    if (level >= level_data.levels.length) return level_data.levels[level_data.levels.length - 1]

    return level_data.levels[level]
}