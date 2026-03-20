<script lang="ts">
    import { abbrNumber } from "$lib/utils/abbr"
    import { data } from "$lib/utils/game_state"
    import { buyPrestigeUpgrade, type PrestigeUpgradeObject } from "./PrestigeUpgrades.render"

    const { prestigeUpgrade, prestigeUpgradeData, prestigeUpgradeObject, columnElement } = $props()

    let columnElementRect: DOMRect | null = null

    let prestigeTokens: number = $state(0)

    let infoVisible: boolean = $state(false)
    let infoX: number = $state(0)
    let infoY: number = $state(0)

    function onItemHover(e: PointerEvent): void {
        infoVisible = true

        if (!columnElement) return

        if (!columnElementRect) {
            columnElementRect = columnElement.getBoundingClientRect()
        }

        infoX = e.clientX - columnElementRect!.left + 50
        infoY = e.clientY - columnElementRect!.top - 50
    }

    function onItemUnhover(e: PointerEvent): void {
        infoVisible = false
    }

    function onItemPointerPositionChange(e: PointerEvent): void {
        if (!columnElement) return
        if (!columnElementRect) return

        infoX = e.clientX - columnElementRect.left + 50
        infoY = e.clientY - columnElementRect.top - 50
    }

    function onBuy() {
        if (!prestigeUpgradeData.unlocked) return
        if (prestigeUpgradeData.owned) return

        buyPrestigeUpgrade(prestigeUpgradeObject)
    }

    function setup(): void {
        data.subscribe(state => {
            prestigeTokens = state.skillTokens
        })
    }

    setup()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div onclick={onBuy} onpointerenter={onItemHover} onpointerleave={onItemUnhover} onpointermove={onItemPointerPositionChange} class="prestige-upgrade-instance" style="opacity: {prestigeUpgradeData.owned ? "1":"0.35"}">
    <img src="/{prestigeUpgradeData.unlocked ? prestigeUpgrade.image:"src/lib/assets/images/icons/lock.png"}"
    style="width: {prestigeUpgradeData.unlocked ? "80":"60"}%"
    alt="">
</div>

{#if infoVisible && prestigeUpgradeData.unlocked}
    <div class="prestige-upgrade-info" style="left: {infoX}px; top: {infoY}px">
        <div class="info-header">
            <img src="{prestigeUpgrade.image}" alt="">
            <h1>{prestigeUpgrade.name}</h1>
            <p class="info-ownership" style="background-color: {prestigeUpgradeData.owned ? "green":"red"}">{prestigeUpgradeData.owned ? "OWNED":"NOT OWNED"}</p>
            <p class="info-cost" style="color: {prestigeTokens >= prestigeUpgrade.cost || prestigeUpgradeData.owned ? "green":"red"}">
                <img src="src/lib/assets/images/icons/token.png" alt="">
                {abbrNumber(prestigeUpgrade.cost)}
            </p>
        </div>
        <div class="info-desc">
            <p>{prestigeUpgrade.desc}</p>
        </div>
    </div>
{/if}

<style>
    .prestige-upgrade-instance {
        width: 100%;
        aspect-ratio: 1/1;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        position: relative;
        transition: all 0.15s;
        cursor: pointer;
        user-select: none;
    }
    .prestige-upgrade-instance:hover {
        scale: 1.05;
    }
    .prestige-upgrade-instance:active {
        scale: 0.95;
    }

    .prestige-upgrade-instance > img {
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        height: 80%;
    }

    .prestige-upgrade-info {
        position: absolute;
        width: 375px;
        height: 120px;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        user-select: none;
        pointer-events: none;
        z-index: 100;
    }

    .info-header {
        width: 100%;
        height: 80px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .info-header > img {
        height: 100%;
        scale: 0.8;
        display: inline-block;
    }

    .info-header > h1 {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        font-size: 1rem;
        position: absolute;
        display: inline-block;
        margin-top: 10px;
        left: 75px;
        margin-left: 10px;
    }

    .info-ownership {
        position: absolute;
        margin: 0;
        font-weight: 700;
        font-family: "Quicksand";
        font-size: 1rem;
        color: white;
        padding: 5px 10px;
        border-radius: 10px;
        bottom: 15px;
        left: 75px;
        margin-left: 10px;
    }

    .info-cost {
        margin: 0;
        font-weight: 700;
        font-family: "Quicksand";
        font-size: 1rem;
        color: white;
        position: absolute;
        right: 10px;
        top: 50%;
        translate: 0 -50%;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info-cost > img {
        height: 100%;
        margin-right: 10px;
        scale: 1.5;
    }

    .info-desc {
        width: 100%;
        height: 40px;
        position: absolute;
        left: 0;
        bottom: 0;
        border-top: 2px solid rgba(0, 0, 0, 0.9);
    }

    .info-desc > p {
        color: white;
        font-weight: 700;
        margin: 0;
        font-size: 1rem;
        font-family: "Quicksand";
        width: 100%;
        height: 100%;
        padding: 10px 10px;
    }
</style>