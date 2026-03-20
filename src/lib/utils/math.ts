export function getRandomInt(min: number, max: number): number {
    if (min >= max) return min

    const diff: number = max - min
    const rn: number = Math.floor(Math.random() * diff)
    
    return min + rn
}

export function getRandomFloat(min: number, max: number, digits: number): number {
    if (min >= max) return min

    const diff: number = (max - min) * Math.pow(10, digits)
    const rn: number = Math.floor(Math.random() * diff)

    return min + (rn / Math.pow(10, digits))
}

export function getFastDistance(x1: number, y1: number, x2: number, y2: number): number {
    const diffX: number = x1 - x2
    const diffY: number = y1 - y2
    
    return diffX * diffX + diffY * diffY
}

export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const diffX: number = x1 - x2
    const diffY: number = y1 - y2

    return Math.sqrt(diffX * diffX + diffY * diffY)
}