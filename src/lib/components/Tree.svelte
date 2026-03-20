<script lang="ts">
    import { data, transferData, type PrestigeBuffs, type CollectibleBuffs, type AchievementBuffs } from "$lib/utils/game_state"
    import { abbrNumber } from "$lib/utils/abbr"
    import { playAnimation, type AnimationInstance } from "$lib/utils/animation"
    import { getRandomInt, getRandomFloat } from "$lib/utils/math"
    import { LEAF_START_SPREAD, LEAF_START_FORCE, TREE_MINIMAL_RESPAWN_TIME } from "$lib/constants/game"
    import { onMount } from "svelte"

    import { getTreesCount, getTreeStats, type TreeStats } from "./Tree.logic"
    import { handleCollectedLeaves, handleCollectedLeavesRemoval, handleLeaves, handleLeavesCollection, handleLeavesReset, type LeafData, type LeafObject } from "./Tree.leaves"
    import { handlePopups, handlePopupRemoval, type Popup } from "./Tree.popups"
    import { getItems, runItemDropChance, isLeafItem, getItemData, onItemCollect, getItemDataByName, type SpecialItem } from "./Tree.items"

    import Leaf from "./Leaf.svelte"
    import CurrencyPopup from "./CurrencyPopup.svelte"

    const { getMainCurrencyRect, checkPrestigeLeavesReset } = $props()

    let coins: number = $state(0)

    let clickDamage: number = 1
    let passiveDamage: number = 0
    let criticalChance: number = 0
    let criticalPower: number = 1

    let currentTreeId: number | null = null
    let treeStats: TreeStats = $state(getTreeStats(0))
    let treeHealth: number = $state(0)
    let treeOwned: boolean = $state(true)
    let treePrice: string = $derived(abbrNumber(treeStats.price))
    let canAfford: boolean = $derived(coins >= treeStats.price)

    let treeImage: string = $derived(treeStats.image)
    let healthBarPercentage: number = $derived((100 / treeStats.health) * treeHealth)
    let healthBarText: string = $derived(abbrNumber(treeHealth) + "/" + abbrNumber(treeStats.health))

    let animations: Array<AnimationInstance> = []
    let healthBarElement: HTMLDivElement | null
    let treeElement: HTMLButtonElement | null

    let leavesLoaded: boolean = false
    let leaves: Array<LeafObject> = $state([])
    let collectedLeaves: Array<LeafObject> = $state([])
    
    let mainContainer: HTMLDivElement | null
    let mainContainerRect: DOMRect | null = $state(null)
    let leafTargetRect: DOMRect | null = null

    let popups: Array<Popup> = $state([])

    let extraXP: number = 0
    let xpMulti: number = 1

    let leftMoveActive: boolean = $derived(treeStats.id > 0)
    let rightMoveActive: boolean = $derived(treeStats.id < getTreesCount() - 1)

    let previousLoopTime: number = 0
    let passiveClickSpeed: number = 1_000
    let passiveClickTimer: number = 0

    let prestigeBuffs: PrestigeBuffs = {
        clickMulti: 1,
        passiveClickMulti: 1,
        fasterPassiveClicks: 1,
        leafCostMulti: 1,
        leafSizeMulti: 1,
        leafExtraCount: 1,
        xpMulti: 1,
        starterCritChance: 0,
        critMulti: 1
    }
    let collectibleBuffs: CollectibleBuffs = {
        critChance: 0,
        clickStrength: 0,
        extraXP: 0,
        passiveClickMulti: 1,
        clickMulti: 1,
        critMulti: 1,
        fasterPassiveClicks: 1,
        xpMulti: 1,
        dropChance: 1
    }
    let achievementBuffs: AchievementBuffs = {
        clickPower: 0,
        passiveClickPower: 0,
        leafCostAdd: 0,
        clickMulti: 1,
        passiveClickMulti: 1,
        xpMulti: 1,
        critMulti: 1
    }

    let possibleItems: Array<SpecialItem> = getItems()

    let treeRespawnTimer: number = 0

    function treeTap(isPassive: boolean): void {
        if (!treeOwned) return
        if (treeRespawnTimer > 0) return

        let criticalDamage: number = 0

        if (getRandomInt(1, 100) <= criticalChance + prestigeBuffs.starterCritChance + collectibleBuffs.critChance) {
            criticalDamage = criticalPower * prestigeBuffs.critMulti * collectibleBuffs.critMulti * achievementBuffs.critMulti
        }

        const usedClickDamage: number = clickDamage + collectibleBuffs.clickStrength + achievementBuffs.clickPower

        const activeDamage: number = Math.floor((usedClickDamage + Math.floor(usedClickDamage * criticalDamage)) * prestigeBuffs.clickMulti * collectibleBuffs.clickMulti * achievementBuffs.clickMulti)
        const usedPassiveDamage: number = Math.floor((passiveDamage + achievementBuffs.passiveClickPower + Math.floor(passiveDamage * criticalDamage)) * prestigeBuffs.passiveClickMulti * collectibleBuffs.passiveClickMulti * achievementBuffs.passiveClickMulti)

        if (isPassive) {
            if (treeHealth - usedPassiveDamage <= 0) {
                treeDestroy()
            }
        }
        else {
            if (treeHealth - activeDamage <= 0) {
                treeDestroy()
            }
        }

        if (healthBarElement) {
            playAnimation(healthBarElement, 0, 1, 0.005, 1.05, -0.005, animations)
        }

        data.update(state => {
            if (isPassive) {
                state.tree.currentHealth -= usedPassiveDamage
            }
            else {
                state.tree.currentHealth -= activeDamage

                state.achievementTracking.treeTaps++
            }

            return state
        })
    }

    function activeClick(): void {
        treeTap(false)
    }

    function passiveClick(): void {
        if (passiveDamage <= 0) return

        treeTap(true)
    }

    function treeDestroy(): void {
        treeRespawnTimer = TREE_MINIMAL_RESPAWN_TIME

        if (treeElement) {
            playAnimation(treeElement, 1, 1, -0.05, 0, 0.05, animations)
        }

        if (!mainContainerRect) {
            if (!mainContainer) return

            mainContainerRect = mainContainer.getBoundingClientRect()
        }

        for (let i = 0; i < treeStats.leafs.amount + prestigeBuffs.leafExtraCount; i++) {
            const x: number = mainContainerRect.width / 2 + getRandomFloat(-75, 75, 2)
            const y: number = 100 + getRandomFloat(-50, 50, 2)

            const leafSize = getRandomFloat(treeStats.leafs.sizeRange[0], treeStats.leafs.sizeRange[1], 2) * prestigeBuffs.leafSizeMulti

            createLeaf(x, y, getRandomFloat(LEAF_START_SPREAD[0], LEAF_START_SPREAD[1], 2), -getRandomInt(LEAF_START_FORCE[0], LEAF_START_FORCE[1]), leafSize, 1)
        }

        const dropItem: SpecialItem | null = runItemDropChance(possibleItems)

        if (dropItem) {
            const x: number = mainContainerRect.width / 2 + getRandomFloat(-75, 75, 2)
            const y: number = 100 + getRandomFloat(-50, 50, 2)

            createItem(x, y, getRandomFloat(LEAF_START_SPREAD[0], LEAF_START_SPREAD[1], 2), -getRandomInt(LEAF_START_FORCE[0], LEAF_START_FORCE[1]), dropItem.size, dropItem.image)
        }

        data.update(state => {
            state.xp += Math.floor((treeStats.xp + extraXP + collectibleBuffs.extraXP) * xpMulti * prestigeBuffs.xpMulti * collectibleBuffs.xpMulti * achievementBuffs.xpMulti)

            state.achievementTracking.treesRemoved++

            return state
        })
    }

    function handleCustomItemDrop() {
        if (transferData.toDropItems.length <= 0) return
        if (!mainContainerRect) return

        const toDropItem: string = transferData.toDropItems[0]
        const dropItem: SpecialItem | null = getItemDataByName(toDropItem)

        if (!dropItem) return

        const x: number = mainContainerRect.width / 2 + getRandomFloat(-75, 75, 2)
        const y: number = 100 + getRandomFloat(-50, 50, 2)

        createItem(x, y, getRandomFloat(LEAF_START_SPREAD[0], LEAF_START_SPREAD[1], 2), -getRandomInt(LEAF_START_FORCE[0], LEAF_START_FORCE[1]), dropItem.size, dropItem.image)

        transferData.toDropItems.splice(0, 1)
    }

    function newPopup(d: LeafData, o: LeafObject): void {
        if (!mainContainerRect) return
        if (!leafTargetRect) return

        let text: string = abbrNumber(d.price)
        let color: string = "#EA4F36"

        if (isLeafItem(o, possibleItems)) {
            const itemData: SpecialItem | null = getItemData(o.image)

            if (itemData) {
                color = itemData.popupColor
                text = itemData.name

                onItemCollect(itemData)
            }
        }

        createPopup(text, color, leafTargetRect.x + leafTargetRect.width / 2 - mainContainerRect.left, leafTargetRect.y + 10 - mainContainerRect.top)
    }

    function createPopup(text: string, color: string, x: number, y: number): void {
        if (text === "0") return

        const popup: Popup = {
            x: x,
            y: y,
            text: text,
            color: color,
            topReached: false
        }

        popups.push(popup)
    }

    function createLeaf(x: number, y: number, fx: number, fy: number, s: number, p: number): void {
        const leaf: LeafData = {
            x: x,
            y: y,
            r: getRandomInt(-180, 180),
            s: s,
            vx: fx,
            vy: fy,
            clickable: true,
            anchor: false,
            afterAnchor: false,
            collected: false,
            targetReached: false,
            brightness: 1 + getRandomFloat(-0.2, 0.2, 2),
            price: p
        }

        leaf.price = getLeafPrice(leaf)
        
        leaves.push({
            data: leaf,
            image: treeStats.leafs.image
        })
    }

    function createItem(x: number, y: number, fx: number, fy: number, s: number, image: string): void {
        const item: LeafData = {
            x: x,
            y: y,
            r: getRandomInt(-180, 180),
            s: s,
            vx: fx,
            vy: fy,
            clickable: true,
            anchor: false,
            afterAnchor: false,
            collected: false,
            targetReached: false,
            brightness: 1,
            price: 0
        }

        leaves.push({
            data: item,
            image: image
        })
    }

    function onLeafHover(e: PointerEvent, d: LeafData): void {
        if (d.collected) return

        d.collected = true

        const mainCurrencyHolderRect: DOMRect | null = getMainCurrencyRect()

        if (mainCurrencyHolderRect) {
            leafTargetRect = mainCurrencyHolderRect
        }

        if (mainContainer) {
            mainContainerRect = mainContainer.getBoundingClientRect()
        }

        handleLeavesReset(leaves, 600, 660)
    }

    function getLeafPrice(d: LeafData): number {
        return Math.floor((treeStats.leafs.cost + treeStats.leafs.costAdd + achievementBuffs.leafCostAdd) * treeStats.leafs.costMulti * d.s * prestigeBuffs.leafCostMulti)
    }

    function onLoopCycle(deltaTime: number): void {
        if (leaves.length > 75) {
            for (const leaf of leaves) {
                leaf.data.collected = true
            }
        }

        handleLeaves(leaves, 600, 660, deltaTime)

        if (!leafTargetRect) {
            leafTargetRect = getMainCurrencyRect()
        }

        if (!mainContainerRect && mainContainer) {
            mainContainerRect = mainContainer.getBoundingClientRect()
        }

        if (leafTargetRect && mainContainerRect) {
            handleCollectedLeaves(
                collectedLeaves, 
                leafTargetRect.x - mainContainerRect.left + 50, 
                leafTargetRect.y - mainContainerRect.top + leafTargetRect.height / 2,
                deltaTime
            )

            handlePopups(popups, leafTargetRect.y - 500, deltaTime)
        }

        const leavesCollection: Array<Array<LeafObject>> = handleLeavesCollection(leaves, collectedLeaves)
        leaves = leavesCollection[0]
        collectedLeaves = handleCollectedLeavesRemoval(leavesCollection[1], newPopup)

        popups = handlePopupRemoval(popups)

        passiveClickTimer += deltaTime * 1_000
            
        if (passiveClickTimer >= (passiveClickSpeed / prestigeBuffs.fasterPassiveClicks) / collectibleBuffs.fasterPassiveClicks) {
            passiveClickTimer = 0

            passiveClick()
        }

        if (checkPrestigeLeavesReset()) {
            leaves = []
            collectedLeaves = []
        }

        if (treeRespawnTimer > 0) {
            treeRespawnTimer -= deltaTime
        }

        handleCustomItemDrop()
    }

    function loop(time: number): void {
        const deltaTime: number = (time - previousLoopTime) / 1_000

        previousLoopTime = time

        onLoopCycle(deltaTime)

        requestAnimationFrame(loop)
    }

    function moveLeft(): void {
        if (!leftMoveActive) return

        data.update(state => {
            state.tree.id -= 1
            state.tree.currentHealth = 0

            return state
        })
    }

    function moveRight(): void {
        if (!rightMoveActive) return

        data.update(state => {
            state.tree.id += 1
            state.tree.currentHealth = 0

            return state
        })
    }

    function onPurchase(): void {
        if (treeOwned) return
        if (!canAfford) return
        
        currentTreeId = null

        data.update(state => {
            state.coins -= treeStats.price
            state.tree.ownedTrees.push(treeStats.id)

            return state
        })
    }

    function setup(): void {
        data.subscribe(state => {
            if (state.tree.id !== currentTreeId) {
                currentTreeId = state.tree.id

                treeStats = getTreeStats(currentTreeId)

                treeOwned = state.tree.ownedTrees.includes(currentTreeId)
            }

            if (!leavesLoaded) {
                leavesLoaded = true

                leaves = state.tree.leaves
                collectedLeaves = state.tree.collectedLeaves
            }

            coins = state.coins

            treeStats.leafs.costAdd = state.tree.currentLeafCost
            treeStats.leafs.costMulti = state.tree.currentLeafMulti

            clickDamage = Math.floor((1 + state.clickPower) * state.clickMulti)
            passiveDamage = Math.floor(state.passiveClickPower * state.passiveClickPower)
            criticalChance = state.criticalHitChance
            criticalPower = state.criticalHitPower

            extraXP = state.xpExtra
            xpMulti = state.xpMulti

            treeHealth = state.tree.currentHealth

            passiveClickSpeed = state.passiveClickSpeed

            prestigeBuffs = state.prestigeBuffs
            collectibleBuffs = state.collectibleBuffs
            achievementBuffs = state.achievementBuffs
        
            if (treeHealth <= 0) {
                data.update(_state => {
                    _state.tree.currentHealth = treeStats.health

                    return _state
                })
            }
        })
    }

    onMount(() => {
        setup()

        requestAnimationFrame(loop)

        setInterval(() => {
            data.update(state => {
                state.tree.leaves = leaves
                state.tree.collectedLeaves = collectedLeaves

                return state
            })
        }, 5_000)
    })
</script>

<div id="main-container" bind:this={mainContainer}>
    <button bind:this={treeElement} id="tree-button" onclick={activeClick} style="filter: grayscale({treeOwned ? "0":"1"}); opacity: {treeOwned ? "1":"0.25"}">
        <img id="tree" src="{treeImage}" alt="">
    </button>

    <div bind:this={healthBarElement} id="health-holder">
        <div id="health-bar" style="width: {healthBarPercentage}%"></div>
        <p>{healthBarText}</p>
        <img src="src/lib/assets/images/icons/axe.png" alt="">
    </div>

    <button onclick={moveRight} id="move-right" style="opacity: {rightMoveActive ? "1":"0.2"}"><img src="src/lib/assets/images/icons/arrow.png" alt=""></button>
    <button onclick={moveLeft} id="move-left" style="opacity: {leftMoveActive ? "1":"0.2"}"><img style="transform: scaleX(-1);" src="src/lib/assets/images/icons/arrow.png" alt=""></button>

    <div id="tree-buy-frame" style="display: {treeOwned ? "none":"block"};">
        <p style="color: {canAfford ? "#EA4F36":"red"};"><img src="src/lib/assets/images/leaves/0.png" alt="">{treePrice}</p>
        <button onclick={onPurchase}>PURCHASE</button>
    </div>

    {#each leaves as leaf}
        <Leaf data={leaf.data} image={leaf.image} onHover={onLeafHover} />
    {/each}

    {#each collectedLeaves as collectedLeaf}
        <Leaf data={collectedLeaf.data} image={collectedLeaf.image} onHover={onLeafHover} />
    {/each}

    {#each popups as popup}
        <CurrencyPopup currency={popup.text} textColor={popup.color} x={popup.x} y={popup.y} />
    {/each}
</div>

<style>
    #main-container {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 600px;
        aspect-ratio: 1/1.1;
        background-color: rgba(0, 0, 0, 0.349);
        translate: -50% -50%;
        z-index: 10;
        border-radius: 14px;
    }

    #tree-button {
        position: absolute;
        left: 50%;
        top: 10%;
        translate: -50%;
        cursor: pointer;
        user-select: none;
        background: none;
        border: none;
        outline: none;
    }
    #tree:hover {
        scale: 1.05;
    }
    #tree:active {
        scale: 0.9;
    }

    #tree {
        width: 200px;
        transition: all 0.15s;
    }

    #health-holder {
        position: absolute;
        left: 50%;
        top: 3%;
        translate: -50% 0;
        width: 250px;
        height: 30px;
        background-color: black;
        pointer-events: none;
        user-select: none;
        background: rgba(0, 0, 0, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.08);
        border-radius: 14px;
        backdrop-filter: blur(6px);
    }

    #health-bar {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: red;
        border-radius: 14px;
        transition: all 0.15s;
    }

    p {
        color: white;
        font-size: 1.25rem;
        font-family: "Quicksand";
        font-weight: 700;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
    }

    #health-holder > img {
        height: 100%;
        z-index: 10;
        translate: -150%;
        scale: 1.5;
    }

    #move-left, #move-right {
        position: absolute;
        width: 60px;
        height: 60px;
        top: 35%;
        cursor: pointer;
        transition: all 0.15s;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 10px;
        backdrop-filter: blur(6px);
        user-select: none;
    }
    #move-left:hover, #move-right:hover {
        scale: 1.05;
    }
    #move-left:active, #move-right:active {
        scale: 0.95;
    }
    #move-left > img, #move-right > img {
        height: 100%;
        width: 100%;
    }
    #move-left {
        left: 10%;
    }
    #move-right {
        right: 10%;
    }

    #tree-buy-frame {
        position: absolute;
        left: 50%;
        top: 29%;
        translate: -50%;
        width: 250px;
        height: 150px;
    }
    #tree-buy-frame > p {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        translate: -5%;
        font-size: 1.75rem;
        position: absolute;
        left: 0;
        top: 10%;
        pointer-events: none;
        user-select: none;
    }
    #tree-buy-frame > p > img {
        height: 100%;
    }
    #tree-buy-frame > button {
        position: absolute;
        left: 50%;
        bottom: 20%;
        translate: -50%;
        font-size: 1.5rem;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 10px;
        backdrop-filter: blur(6px);
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        cursor: pointer;
        transition: all 0.15s;
        user-select: none;
    }
    #tree-buy-frame > button:hover {
        scale: 1.05;
    }
    #tree-buy-frame > button:active {
        scale: 0.95;
    }
</style>