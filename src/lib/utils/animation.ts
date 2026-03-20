import { browser } from "$app/environment"

export interface AnimationInstance {
    state: boolean,
    intervalId: number,
    animationId: number,
    entryState: number,
    entrySpeed: number,
    exitState: number,
    exitSpeed: number,
    elementScale: number,
    element: HTMLElement
}

function isAnimation(animationId: number, animations: Array<AnimationInstance>): boolean {
    for (const animation of animations) {
        if (animation.animationId !== animationId) continue

        return true
    }

    return false
}

function getAnimation(animationId: number, animations: Array<AnimationInstance>): AnimationInstance | null {
    for (const animation of animations) {
        if (animation.animationId !== animationId) continue

        return animation
    }

    return null
}

function removeAnimation(animationId: number, animations: Array<AnimationInstance>): void {
    for (let i = 0; i < animations.length; i++) {
        const animation: AnimationInstance = animations[i]

        if (animation.animationId !== animationId) continue

        clearInterval(animation.animationId)

        break
    }
}

function animationFrame(animation: AnimationInstance, animations: Array<AnimationInstance>): void {
    const animationDirection: number = Math.sign(animation.entrySpeed)

    if (animationDirection === 0) {
        removeAnimation(animation.animationId, animations)

        return
    }

    if (animation.state) {
        if (animationDirection === 1) {
            if (animation.elementScale > animation.entryState) {
                animation.elementScale += animation.exitSpeed
            }
            else {
                animation.elementScale = animation.entryState

                removeAnimation(animation.animationId, animations)
            }
        }
        else {
            if (animation.elementScale < animation.entryState) {
                animation.elementScale += animation.exitSpeed
            }
            else {
                animation.elementScale = animation.entryState

                removeAnimation(animation.animationId, animations)
            }
        }
    }
    else {
        if (animationDirection === 1) {
            if (animation.elementScale < animation.exitState) {
                animation.elementScale += animation.entrySpeed
            }
            else {
                animation.elementScale = animation.exitState
                animation.state = true
            }
        }
        else {
            if (animation.elementScale > animation.exitState) {
                animation.elementScale += animation.entrySpeed
            }
            else {
                animation.elementScale = animation.exitState
                animation.state = true
            }
        }
    }

    animation.element.style.scale = `${animation.elementScale}`
}

function rerunAnimation(animationId: number, animations: Array<AnimationInstance>): void {
    const animation: AnimationInstance | null = getAnimation(animationId, animations)

    if (!animation) return

    clearInterval(animation.intervalId)

    animation.state = false
    animation.intervalId = setInterval(() => { animationFrame(animation, animations) }, 5)
}

function createAnimation(element: HTMLElement, animationId: number, entryState: number, entrySpeed: number, exitState: number, exitSpeed: number, animations: Array<AnimationInstance>): void {
    const animation: AnimationInstance = {
        state: false,
        intervalId: 0,
        animationId: animationId,
        entryState: entryState,
        entrySpeed: entrySpeed,
        exitState: exitState,
        exitSpeed: exitSpeed,
        elementScale: entryState,
        element: element
    }

    animation.intervalId = setInterval(() => { animationFrame(animation, animations) }, 5)

    animations.push(animation)
}

export function playAnimation(element: HTMLElement, animationId: number, entryState: number, entrySpeed: number, exitState: number, exitSpeed: number, animations: Array<AnimationInstance>): void {
    if (!browser) return

    if (isAnimation(animationId, animations)) {
        rerunAnimation(animationId, animations)
    }
    else {
        createAnimation(element, animationId, entryState, entrySpeed, exitState, exitSpeed, animations)
    }
}