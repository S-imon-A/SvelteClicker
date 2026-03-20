<script lang="ts">
    import { dropItem, isNumber } from "./CheatWindow.utils"
    import { getItems, type SpecialItem } from "./Tree.items"
    import { data } from "$lib/utils/game_state"

    const { active } = $props()

    let toDropItems: Array<SpecialItem> = $state([])
    let selectedToDropItem: string = $state("")

    let coinsInput: string = $state("")
    let prestigeTokensInput: string = $state("")
    let xpInput: string = $state("")
    let itemDropCountInput: string = $state("")

    function setup(): void {
        toDropItems = getItems()
        
        if (toDropItems.length > 0) selectedToDropItem = toDropItems[0].name
    }

    function onCoinsValueSet(): void {
        let coins: number = parseInt(coinsInput)

        if (!isNumber(coins)) return
        if (coins < 0) return

        data.update(state => {
            state.coins = coins

            return state
        })
    }

    function onPrestigeTokensValueSet(): void {
        let prestigeTokens: number = parseInt(prestigeTokensInput)

        if (!isNumber(prestigeTokens)) return
        if (prestigeTokens < 0) return

        data.update(state => {
            state.skillTokens = prestigeTokens

            return state
        })
    }

    function onXPTokensValueSet(): void {
        let xp: number = parseInt(xpInput)

        if (!isNumber(xp)) return
        if (xp < 0) return

        data.update(state => {
            state.xp = xp

            return state
        })
    }

    function onDropItems(): void {
        let dropCount: number = parseInt(itemDropCountInput)

        if (!isNumber(dropCount)) return
        if (dropCount < 0 || dropCount > 100) return
        
        for (let i = 0; i < dropCount; i++) {
            dropItem(selectedToDropItem)
        }
    }

    function buyUpgrades(): void {
        
    }

    function buyAllUpgrades(count: number): void {
        if (count < 0) return

        for (let i = 0; i < count; i++) {
            buyUpgrades()
        }
    }

    setup()
</script>

{#if active}
    <div class="background-blur">
        <div class="cheat-window">
            <h1>Cheats</h1>

            <div class="coins-cheat cheat-option">
                <label for="cheat-coins">Coins:</label>
                <input bind:value={coinsInput} type="text" id="cheat-coins" placeholder="Coins ...">
                <button onclick={onCoinsValueSet}>SET</button>
            </div>

            <div class="prestige-tokens-cheat cheat-option">
                <label for="cheat-prestige-tokens">Prestige tokens:</label>
                <input bind:value={prestigeTokensInput} type="text" id="cheat-prestige-tokens" placeholder="Prestige tokens ...">
                <button onclick={onPrestigeTokensValueSet}>SET</button>
            </div>

            <div class="xp-cheat cheat-option">
                <label for="cheat-xp">XP:</label>
                <input bind:value={xpInput} type="text" id="cheat-xp" placeholder="XP ...">
                <button onclick={onXPTokensValueSet}>SET</button>
            </div>

            <div class="item-cheat cheat-option">
                <label for="cheat-item">Drop {selectedToDropItem}:</label>
                <input bind:value={itemDropCountInput} type="text" id="cheat-item" placeholder="Item count ...">
                <button onclick={onDropItems}>DROP</button>
            </div>

            <div class="cheat-option items-to-drop">
                {#each toDropItems as toDropItem}
                    <div>
                        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <img onclick={() => { selectedToDropItem = toDropItem.name }} src="{toDropItem.image}" alt="">
                    </div>
                {/each}
            </div>

            <button style="display: none;" onclick={() => { buyAllUpgrades(10) }} class="all-upgrades">GET ALL UPGRADES 10X</button>
        </div>
    </div>
{/if}

<style>
    .background-blur {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 5000;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .cheat-window {
        background: rgba(22, 22, 22, 0.95);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        width: 400px;
        /*height: 465px;*/
        height: 420px;
    }

    .cheat-window > h1 {
        text-align: center;
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        user-select: none;
        pointer-events: none;
        font-size: 1.5rem;
        border-bottom: 2px solid rgba(0, 0, 0, 0.9);
        padding-bottom: 15px;
    }

    .cheat-option {
        padding: 10px 0;
        position: relative;
        width: 90%;
        left: 50%;
        translate: -50%;
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 10px;
    }
    .cheat-option > button {
        position: absolute;
        right: 0;
        font-family: "Quicksand";
        font-weight: 700;
        color: white;
        cursor: pointer;
        padding: 5px 10px;
        background: green;
        border: 2px solid green;
        border-radius: 10px;
        transition: all 0.15s;
        user-select: none;
    }
    .cheat-option > button:hover {
        scale: 1.05;
    }
    .cheat-option > button:active {
        scale: 0.95;
    }
    .cheat-option > label {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        user-select: none;
    }
    .cheat-option > input {
        outline: 0;
        margin: 0;
        font-family: "Quicksand";
        font-weight: 700;
        color: white;
        background: none;
        border: 2px solid white;
        border-radius: 10px;
        padding: 5px;
        transition: all 0.15s;
    }
    .cheat-option > input:focus {
        border-color: green;
    }

    .items-to-drop {
        display: block;
    }
    .items-to-drop > div {
        width: 51.4px;
        aspect-ratio: 1/1;
        display: inline-block;
        position: relative;
    }
    .items-to-drop > div > img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        scale: 0.9;
        transition: all 0.15s;
        cursor: pointer;
    }
    .items-to-drop > div > img:hover {
        scale: 1.05;
    }
    .items-to-drop > div > img:active {
        scale: 0.95;
    }

    .all-upgrades {
        color: white;
        font-family: "Quicksand";
        font-weight: 700;
        border: none;
        background-color: green;
        transition: all 0.15s;
        cursor: pointer;
        padding: 10px 20px;
        border-radius: 14px;
        position: relative;
        left: 50%;
        translate: -50%;
    }
    .all-upgrades:hover {
        scale: 1.02;
    }
    .all-upgrades:active {
        scale: 0.95;
    }
</style>