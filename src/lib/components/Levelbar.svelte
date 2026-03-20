<script lang="ts">
    import { abbrNumber } from "$lib/utils/abbr"
    import { playAnimation, type AnimationInstance } from "$lib/utils/animation"

    const { progress, reqCur, reqMax, level } = $props()

    let animations: Array<AnimationInstance> = []
    let levelbar: HTMLDivElement | null

    let previousReqCur: string | null = null

    $effect(() => {
        if (previousReqCur !== reqCur) {
            previousReqCur = reqCur

            if (levelbar) {
                playAnimation(levelbar, 0, 1, 0.0025, 1.025, -0.0025, animations)
            }
        }
    })
</script>

<div bind:this={levelbar} id="levelbar-holder">
    <div id="levelbar" style="width: {progress}%;"></div>
    <p id="level-req">{abbrNumber(reqCur)}/{abbrNumber(reqMax)} XP</p>
    <p id="level-cur">LEVEL {level}</p>
</div>

<style>
    #levelbar-holder {
        width: calc(600px - 4px);
        height: 25px;
        pointer-events: none;
        user-select: none;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 10px;
        backdrop-filter: blur(6px);
        position: absolute;
        top: 75px;
        left: 50%;
        translate: -50%;
    }

    #levelbar {
        background-color: rgb(23, 160, 23);
        width: 15%;
        height: 100%;
        border-radius: 9px;
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.15s;
    }

    #level-req {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        color: white;
        font-size: 0.75rem;
        font-weight: 700;
        font-family: "Quicksand";
    }

    #level-cur {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: -125%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
    }
</style>