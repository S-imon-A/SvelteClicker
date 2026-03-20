import { ABBR_TABLE, MINUTE, HOUR, DAY } from "$lib/constants/game"

export function abbrNumber(number: number): string {
    if (number >= 1_000) number = Math.floor(number)

    let finalNum: string = ""
    let numString: string = number.toLocaleString("fullwide", { useGrouping: false })

    let digits: number = numString.length

    if (digits < 4 || number < 1_000) return numString

    let digitsBefore: number = digits % 3

    if (digitsBefore === 0) digitsBefore = 3

    const digitsToCut: number = digits - digitsBefore
    const abbrIndex: number = Math.round(digitsToCut / 3)

    const abbr: string = ABBR_TABLE[abbrIndex]

    let numAfterDot: string = numString.slice(digitsBefore, digitsBefore + 2)
    let dot: string = "."

    if (numAfterDot === "00") {
        dot = ""
        numAfterDot = ""
    }
    else if (numAfterDot.slice(1, 2) === "0") {
        numAfterDot = numAfterDot.slice(0, 1)
    }

    finalNum = numString.slice(0, digitsBefore) + dot + numAfterDot + abbr

    return finalNum
}

export function abbrTimeNumber(number: number): string {
    const days: number = Math.floor(number / DAY)
    const hours: number = Math.floor((number - days * DAY) / HOUR)
    const minutes: number = Math.floor((number - days * DAY - hours * HOUR) / MINUTE)
    const seconds: number = Math.floor(number - days * DAY - hours * HOUR - minutes * MINUTE)

    let finalString: string = ""

    let secondsString: string = seconds.toString()
    if (secondsString.length === 1) secondsString = "0" + secondsString

    let minutesString: string = minutes.toString()
    if (minutesString.length === 1) minutesString = "0" + minutesString

    let hoursString: string = hours.toString()
    if (hoursString.length === 1) hoursString = "0" + hoursString

    if (days) {
        finalString = `${days}d ${hoursString}h ${minutesString}m ${secondsString}s`
    }
    else if (hours) {
        finalString = `${hours}h ${minutesString}m ${secondsString}s`
    }
    else if (minutes) {
        finalString = `${minutes}m ${secondsString}s`
    }
    else {
        finalString = `${seconds}s`
    }

    return finalString
}