// LOCAL STORAGE SAVE KEY
export const SAVE_KEY: string = "TapTheTree_SaveKey"

// CURRENCY
export const ABBR_TABLE: Array<string> = [
    "", "K", "M", "B", "T", "Qd", "Qi", "Sx", "Sp", "Oct", "Non", "Dec", "Und", "Dod", "Tre", "Qud", "Qup", "Sxd", "Sed", "Ocd", "Nod", "Vig", "Uvg", "Dvg", "Tvg", "Qvg"
]
export const POPUP_SPEED: number = 100

// TIME
export const MINUTE: number = 60
export const HOUR: number = MINUTE * 60
export const DAY: number = HOUR * 24

// PHYSICS
export const GRAVITY: number = 9.8
export const LEAF_FALL_SPEED: number = 50
export const LEAF_SIZE: number = 50
export const LEAF_SIZE_OFFSET: number = 1.8
export const LEAF_WALL_BOUNCE: number = 0.6
export const LEAF_REST_THRESHOLD: number = 20
export const LEAF_START_FORCE: Array<number> = [200, 350]
export const LEAF_START_SPREAD: Array<number> = [-200, 200]
export const LEAF_COLLECT_SPEED: number = 100
export const LEAF_COLLECT_TARGET_RADIUS: number = 70

// ITEMS
export const ITEM_DROP_CHANCE_RANGE: number = 1_000_000_000

// TREE
export const TREE_MINIMAL_RESPAWN_TIME: number = 0.1