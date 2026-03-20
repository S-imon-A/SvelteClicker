<script lang="ts">
    const { collectibleObject, frameElement } = $props()

    let frameElementRect: DOMRect | null = null

    let infoVisible: boolean = $state(false)
    let infoX: number = $state(0)
    let infoY: number = $state(0)

    function onItemHover(e: PointerEvent): void {
        infoVisible = true

        if (!frameElement) return

        if (!frameElementRect) {
            frameElementRect = frameElement.getBoundingClientRect()
        }

        infoX = e.clientX - frameElementRect!.left + 100
        infoY = e.clientY - frameElementRect!.top - 50
    }

    function onItemUnhover(e: PointerEvent): void {
        infoVisible = false
    }

    function onItemPointerPositionChange(e: PointerEvent): void {
        if (!frameElement) return
        if (!frameElementRect) return

        infoX = e.clientX - frameElementRect.left + 100
        infoY = e.clientY - frameElementRect.top - 50
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="collectible-item" onpointerenter={onItemHover} onpointerleave={onItemUnhover} onpointermove={onItemPointerPositionChange}>
    <p style="color: {collectibleObject.owned ? "white":"rgb(200, 200, 200)"}">{collectibleObject.collectibleData.dropChance.toString()}%</p>
    <img style="filter: brightness({collectibleObject.owned ? "1":"0"})" src="{collectibleObject.collectibleData.image}" alt="">
    <h1 style="color: {collectibleObject.owned ? "white":"rgb(200, 200, 200)"}">{collectibleObject.owned ? collectibleObject.collectibleData.name:"?????"}</h1>
</div>

{#if infoVisible && collectibleObject.owned}
    <div class="hover-info" style="left: {infoX}px; top: {infoY}px">
        <div class="hover-info-header">
            <img src="/{collectibleObject.collectibleData.image}" alt="">
            <h1>{collectibleObject.collectibleData.name}</h1>
            <p class="info-ownership">{collectibleObject.collectibleData.dropChance.toString()}% drop chance</p>
        </div>
        <div class="hover-info-desc">
            <p class="item-desc">{collectibleObject.collectibleData.desc}</p>
            <p class="item-boost">{collectibleObject.collectibleData.boostText}</p>
        </div>
    </div>
{/if}

<style>
    .collectible-item {
        position: relative;
        background: rgba(50, 50, 50, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
    }

    .collectible-item > img {
        position: absolute;
        height: 70%;
        top: 10%;
        left: 50%;
        translate: -50%;
        scale: 0.9;
        user-select: none;
        pointer-events: none;
    }

    .collectible-item > h1 {
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        position: absolute;
        left: 50%;
        translate: -50%;
        bottom: 0;
        padding: 5px;
        user-select: none;
        pointer-events: none;
    }

    .collectible-item > p {
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        position: absolute;
        left: 50%;
        top: 0;
        translate: -50%;
        padding: 5px;
        user-select: none;
        pointer-events: none;
    }

    .hover-info {
        position: absolute;
        width: 375px;
        height: 185px;
        background: rgba(22, 22, 22, 0.95);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        z-index: 500;
        user-select: none;
        pointer-events: none;
    }

    .hover-info-header {
        width: 100%;
        height: 80px;
        position: absolute;
        left: 0;
        top: 0;
        background: none;
        border: none;
    }

    .hover-info-header > img {
        height: 100%;
        scale: 0.8;
        display: inline-block;
    }

    .hover-info-header > h1 {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        font-size: 1.5rem;
        position: absolute;
        margin-top: 10px;
        left: 75px;
        margin-left: 10px;
        display: inline-block;
    }

    .info-ownership {
        position: absolute;
        margin: 0;
        font-weight: 700;
        font-family: "Quicksand";
        font-size: 1rem;
        color: white;
        border-radius: 10px;
        bottom: 15px;
        left: 75px;
        margin-left: 10px;
    }

    .hover-info-desc {
        background: none;
        border: none;
        width: 100%;
        height: 40px;
        position: absolute;
        left: 0;
        top: 80px;
        border-top: 2px solid rgba(0, 0, 0, 0.9);
    }
    
    .hover-info-desc > p {
        color: white;
        font-weight: 700;
        margin: 0;
        font-size: 1rem;
        font-family: "Quicksand";
        width: 90%;
        height: 100%;
        padding: 10px 10px;
        translate: -50%;
        left: 50%;
        position: relative;
    }
    .hover-info-desc > p:first-child {
        font-style: italic;
        color: rgb(200, 200, 200);
    }
</style>