<script lang="ts">
    import { getUpgradeBoostText } from "./Shop.upgrades"

    const { image, name, level, price, currencyImage, itemObject, buyTrigger, priceNumber, userCoins, mega, giga } = $props()

    let shopItemElement: HTMLDivElement | null
    let shopItemElementRect: DOMRect | null = null

    let priceText: HTMLParagraphElement | null

    let infoMsg: string = $state("")
    let infoVisible: boolean = $state(false)
    let infoX: number = $state(0)
    let infoY: number = $state(0)

    $effect(() => {
        if (!priceText) return

        if (userCoins >= priceNumber) {
            priceText.style.color = "#EA4F36"
        }
        else {
            priceText.style.color = "red"
        }
    })

    function onItemHover(e: PointerEvent): void {
        infoVisible = true

        infoMsg = getUpgradeBoostText(itemObject)

        if (!shopItemElement) return

        if (!shopItemElementRect) {
            shopItemElementRect = shopItemElement.getBoundingClientRect()
        }
        
        infoX = e.clientX - shopItemElementRect.left
        infoY = e.clientY - shopItemElementRect.top - 40
    }

    function onItemUnhover(e: PointerEvent): void {
        infoVisible = false
    }

    function onItemPointerPositionChange(e: PointerEvent): void {
        infoMsg = getUpgradeBoostText(itemObject)

        if (!shopItemElement) return
        if (!shopItemElementRect) return

        infoX = e.clientX - shopItemElementRect.left
        infoY = e.clientY - shopItemElementRect.top - 40
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={shopItemElement} class="shop-item-holder" onpointerdown={(e) => {buyTrigger(e, itemObject)}}>
    <div class="shop-item" onpointerenter={onItemHover} onpointerleave={onItemUnhover} onpointermove={onItemPointerPositionChange}>
        <img src="/{image}" alt="">
        <div>
            <p style="color: {mega ? giga ? "red":"yellow":"white"}">{name}</p>
            <div>
                <p bind:this={priceText}><img src="{currencyImage}" alt="">{price}</p>
            </div>
            <h1 style="color: {mega ? giga ? "red":"yellow":"white"}">LEVEL {level}</h1>
        </div>
    </div>

    <p class="shop-item-info" style="display: {infoVisible ? "block":"none"}; left: {infoX}px; top: {infoY}px">{infoMsg}</p>
</div>

<style>
    .shop-item-holder {
        width: 100%;
        height: 60px;
        position: relative;
    }

    .shop-item {
        width: 100%;
        height: 50px;
        position: relative;
        scale: 0.95;
        margin-top: 5px;
        cursor: pointer;
        transition: all 0.15s;
    }
    .shop-item:hover {
        scale: 0.975;
    }
    .shop-item:active {
        scale: 0.9;
    }

    .shop-item > img {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .shop-item > div {
        position: absolute;
        height: 100%;
        width: calc(100% - 50px);
        left: 50px;
        top: 0;
    }

    .shop-item > div > p {
        position: absolute;
        margin: 0;
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        font-size: 1.25rem;
        left: 0;
        top: 0;
        margin-left: 2.5px;
        margin-top: 2.5px;
    }

    .shop-item > div > div {
        position: absolute;
        height: 25px;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .shop-item > div > div > p {
        position: absolute;
        height: 100%;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
        color: #EA4F36;
        font-weight: 700;
        font-family: "Quicksand";
        filter: brightness(1.2);
    }
    .shop-item > div > div > p > img {
        height: 100%;
        scale: 0.9;
    }

    .shop-item > div > h1 {
        position: absolute;
        right: 0;
        top: 50%;
        translate: 0 -50%;
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        font-size: 1.25rem;
        margin-right: 5px;
    }

    .shop-item-info {
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        font-size: 1.25rem;
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        padding: 5px 10px;
        user-select: none;
        pointer-events: none;
        transition: display 0.15s;
        z-index: 10;
        min-width: max-content;
    }
</style>