<script lang="ts">
    import { data } from "$lib/utils/game_state"
    import { abbrNumber } from "$lib/utils/abbr"

    import { buyUpgrade, resolveUpgrades, getUpgradePrice, type UpgradeObject } from "./Shop.upgrades"

    import ShopItem from "./ShopItem.svelte"

    const { checkPrestigeUpgradesReset } = $props()

    let userCoins: number = $state(0)

    let shopContent: Array<UpgradeObject> = $state([])
    let currentCategory: number = $state(0)

    function upgradeBuyTrigger(e: PointerEvent, upgrade: UpgradeObject): void {
        buyUpgrade(upgrade)
    }

    function switchCategory(category: number): void {
        shopContent = resolveUpgrades(category)

        currentCategory = category
    }

    function setup(): void {
        data.subscribe(state => {
            userCoins = state.coins

            if (checkPrestigeUpgradesReset()) {
                switchCategory(currentCategory)
            }
        })

        shopContent = resolveUpgrades(0)
    }

    setup()
</script>

<div id="shop-holder">
    <div id="shop-header"><p>SHOP</p></div>
    <div id="shop-content">
        {#each shopContent as item}
            <ShopItem
                buyTrigger={upgradeBuyTrigger}
                itemObject={item}
                currencyImage={"src/lib/assets/images/leaves/0.png"}
                name={item.upgradeData.name}
                image={item.upgradeData.image}
                level={abbrNumber(item.data.count)}
                price={abbrNumber(getUpgradePrice(item))}
                priceNumber={getUpgradePrice(item)}
                userCoins={userCoins}
                mega={item.data.count >= 100}
                giga={item.data.count >= 400}
            />
        {/each}
    </div>

    <div id="shop-categories">
        <button onclick={() => {switchCategory(0)}} style="opacity: {currentCategory === 0 ? "1":"0.6"}"><img src="/src/lib/assets/images/icons/shop.png" alt=""></button>
        <button onclick={() => {switchCategory(1)}} style="opacity: {currentCategory === 1 ? "1":"0.6"}"><img src="/src/lib/assets/images/leaves/0.png" alt=""></button>
    </div>
</div>

<style>
    #shop-holder {
        width: 350px;
        height: 660px;
        user-select: none;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        position: absolute;
        right: 50px;
        top: 50%;
        translate: 0 -50%;
    }

    #shop-header {
        position: absolute;
        width: 100%;
        height: 50px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.9);
    }
    #shop-header > p {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        color: white;
        font-weight: 700;
        font-size: 1.5rem;
        font-family: "Quicksand";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    #shop-content {
        position: absolute;
        height: calc(100% - 52px);
        width: 100%;
        top: 52px;
        left: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        gap: 10px;
    }

    #shop-categories {
        position: absolute;
        width: 50px;
        height: 90%;
        left: 0;
        top: 7.5%;
        translate: -100%;
    }

    #shop-categories > button {
        width: 100%;
        aspect-ratio: 1/1;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        backdrop-filter: blur(6px);
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        cursor: pointer;
    }
    #shop-categories > button > img {
        width: 100%;
        height: 100%;
        transition: all 0.15s;
    }
    #shop-categories > button:hover > img {
        scale: 1.05;
    }
    #shop-categories > button:active > img {
        scale: 0.95;
    }
</style>