import { data } from "$lib/utils/game_state"
import { LEAF_SIZE, LEAF_SIZE_OFFSET, LEAF_FALL_SPEED, GRAVITY, LEAF_REST_THRESHOLD, LEAF_COLLECT_TARGET_RADIUS } from "$lib/constants/game"
import { getDistance, getFastDistance } from "$lib/utils/math"

export interface LeafData {
    x: number,
    y: number,
    r: number,
    s: number,
    vx: number,
    vy: number,
    clickable: boolean,
    anchor: boolean,
    afterAnchor: boolean,
    collected: boolean,
    targetReached: boolean,
    brightness: number,
    price: number
}

export interface LeafObject {
    data: LeafData,
    image: string
}

export function getLeafSize(leafData: LeafData): number {
    return (LEAF_SIZE / LEAF_SIZE_OFFSET) * leafData.s
}

export function handleLeavesCollection(leaves: Array<LeafObject>, collectedLeaves: Array<LeafObject>): Array<Array<LeafObject>> {
    let notCollectedLeaves: Array<LeafObject> = []

    for (const leaf of leaves) {
        const data: LeafData = leaf.data

        if (data.collected) {
            collectedLeaves.push(leaf)
        }
        else {
            notCollectedLeaves.push(leaf)
        }
    }

    return [notCollectedLeaves, collectedLeaves]
}

export function handleCollectedLeavesRemoval(collectedLeaves: Array<LeafObject>, popupHandler: (d: LeafData, o: LeafObject) => void): Array<LeafObject> {
    let notCollectedLeaves: Array<LeafObject> = []

    for (const leaf of collectedLeaves) {
        const leafData: LeafData = leaf.data

        if (leafData.targetReached) {
            data.update(state => {
                state.coins += leafData.price

                state.achievementTracking.leavesCollected++

                return state
            })

            popupHandler(leafData, leaf)
        }
        else {
            notCollectedLeaves.push(leaf)
        }
    }

    return notCollectedLeaves
}

export function handleSideCollisions(leafData: LeafData, containerWidth: number, containerHeight: number): void {
    const size: number = getLeafSize(leafData)
    const radius: number = size * 0.5

    if (leafData.x - radius < 0) {
        leafData.x = radius
        leafData.vx = 0

        return
    }

    if (leafData.x + radius > containerWidth) {
        leafData.x = containerWidth - radius
        leafData.vx = 0

        return
    }

    if (leafData.y - radius < 0) {
        leafData.y = radius
        leafData.vy = 0

        return
    }

    if (leafData.y + radius >= containerHeight) {
        leafData.y = containerHeight - radius
        leafData.vy = 0
        leafData.vx = 0
        leafData.anchor = true

        return
    }
}

export function handleLeafToLeafCollisions(leafData: LeafData, leaves: Array<LeafObject>): void {
    const leafSize: number = getLeafSize(leafData)
    let data: LeafData
    let size: number
    let minDist: number

    for (const leaf of leaves) {
        data = leaf.data

        if (!data.anchor) continue

        size = getLeafSize(data)
        minDist = size * 0.5 + leafSize * 0.5

        if (getFastDistance(leafData.x, leafData.y, data.x, data.y) > minDist * minDist || Math.abs(leafData.x - data.x) > 5) continue

        leafData.anchor = true

        break
    }
}

export function handleLeaves(leaves: Array<LeafObject>, containerWidth: number, containerHeight: number, deltaTime: number): void {
    for (const leaf of leaves) {
        const data: LeafData = leaf.data

        if (data.anchor) continue

        data.vy += LEAF_FALL_SPEED * GRAVITY * deltaTime

        if (Math.abs(data.vx) > LEAF_REST_THRESHOLD) {
            if (data.vx < 0) {
                data.vx += LEAF_FALL_SPEED * deltaTime
            }
            else {
                data.vx -= LEAF_FALL_SPEED * deltaTime
            }
        }
        else {
            data.vx = 0
        }

        data.x += data.vx * deltaTime
        data.y += data.vy * deltaTime

        handleSideCollisions(data, containerWidth, containerHeight)
        handleLeafToLeafCollisions(data, leaves)
    }
}

export function handleLeafNeighbors(l: LeafObject, x: number, y: number, size: number, leaves: Array<LeafObject>) {
    for (const leaf of leaves) {
        if (l === leaf) continue

        const data: LeafData = leaf.data

        if (data.afterAnchor || data.collected) continue

        const leafSize: number = getLeafSize(data)
        const minDist: number = leafSize / 2 + size / 2

        if (getFastDistance(x, y, data.x, data.y) > minDist * minDist || Math.abs(x - data.x) > 5) continue

        data.afterAnchor = true

        handleLeafNeighbors(leaf, data.x, data.y, leafSize, leaves)
    }
}

export function handleLeavesReset(leaves: Array<LeafObject>, containerWidth: number, containerHeight: number): void {
    let unAnchoredLeaves: Array<LeafObject> = []

    for (const leaf of leaves) {
        const data: LeafData = leaf.data

        if (data.collected) continue

        data.anchor = false

        handleSideCollisions(data, containerWidth, containerHeight)

        if (data.anchor) {
            data.afterAnchor = true
        }
        else {
            unAnchoredLeaves.push(leaf)
        }
    }

    for (const leaf of leaves) {
        const data: LeafData = leaf.data

        if (!data.afterAnchor) continue

        const size: number = getLeafSize(data)

        handleLeafNeighbors(leaf, data.x, data.y, size, unAnchoredLeaves)
    }

    for (const leaf of leaves) {
        const data: LeafData = leaf.data

        if (data.afterAnchor) {
            data.anchor = true
        }
        else {
            data.anchor = false
        }

        data.afterAnchor = false
    }
}

export function handleCollectedLeaves(leaves: Array<LeafObject>, targetX: number, targetY: number, deltaTime: number): void {
    let data: LeafData
    let xDist: number
    let yDist: number
    let xMove: number
    let yMove: number

    for (const leaf of leaves) {
        data = leaf.data

        xDist = targetX - data.x
        yDist = targetY - data.y

        xMove = (xDist / LEAF_FALL_SPEED * 100)
        yMove = (yDist / LEAF_FALL_SPEED * 100)

        data.x += xMove * deltaTime
        data.y += yMove * deltaTime

        if (getDistance(data.x, data.y, targetX, targetY) > LEAF_COLLECT_TARGET_RADIUS) continue

        data.targetReached = true
    }
}