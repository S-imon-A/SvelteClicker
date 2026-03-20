<script lang="ts">
    import { playAnimation, type AnimationInstance } from "$lib/utils/animation"

    const { currency, image, textColor, nodesign, margin } = $props()

    let animations: Array<AnimationInstance> = []
    let currencyText: HTMLParagraphElement | null

    let previousCurrency: string | null = null

    $effect(() => {
        if (previousCurrency !== currency) {
            previousCurrency = currency

            if (currencyText) {
                playAnimation(currencyText, 0, 1, 0.01, 1.3, -0.01, animations)
            }
        }
    })
</script>

<div style="background: {nodesign ? "none":"rgba(22, 22, 22, 0.85)"}; backdrop-filter: {nodesign ? "none":"blur(6px)"}; border-color: {nodesign ? "transparent":"rgba(0, 0, 0, 0.9)"}">
    <p bind:this={currencyText} style="color: {textColor}"><img src="/{image}" alt="" style="margin-right: {margin}px">{currency}</p>
</div>

<style>
    div {
        position: relative;
        width: 250px;
        height: 50px;
        overflow: hidden;
        pointer-events: none;
        user-select: none;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
    }

    img {
        height: 35px;
        aspect-ratio: 1/1;
    }

    p {
        display: inline-flex;
        margin: 0;
        font-size: 1.5rem;
        height: 100%;
        width: 100%;
        padding: 0;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: -10px;
        font-weight: 700;
        font-family: "Quicksand";
        transition: all 0.15s;
        filter: brightness(1.2);
    }
</style>