import { transferData } from "$lib/utils/game_state"

export function dropItem(itemName: string) {
    transferData.toDropItems.push(itemName)
}

export function isNumber(likelyNumber: any): boolean {
    if (typeof(likelyNumber) !== "number") return false
    if (Number.isNaN(likelyNumber)) return false

    return true
}