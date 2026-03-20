import { POPUP_SPEED } from "$lib/constants/game"

export interface Popup {
    x: number,
    y: number,
    text: string,
    color: string,
    topReached: boolean
}

export function handlePopups(popups: Array<Popup>, top: number, deltaTime: number): void {
    for (const popup of popups) {
        popup.y -= POPUP_SPEED * deltaTime

        if (popup.y > top) continue

        popup.topReached = true
    }
}

export function handlePopupRemoval(popups: Array<Popup>): Array<Popup> {
    let notTopReachedPopups: Array<Popup> = []

    for (const popup of popups) {
        if (popup.topReached) continue

        notTopReachedPopups.push(popup)
    }

    return notTopReachedPopups
}