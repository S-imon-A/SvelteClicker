<script lang="ts">
    import { abbrNumber } from "$lib/utils/abbr"
    import { data } from "$lib/utils/game_state"
    import { getItemDropChanceString } from "./Tree.items"

    import CurrencyHolder from "./CurrencyHolder.svelte"

    const { openPrestigeMenuHandler, prestige } = $props()

    let canPrestige: boolean = $state(false)

    let prestigeRunTokens: number = $state(0)
    let prestigeTokensAbbr: string = $derived(abbrNumber(prestigeRunTokens))

    function setup(): void {
        data.subscribe(state => {
            prestigeRunTokens = state.runSkillTokens
            canPrestige = state.canPrestige
        })
    }

    setup()
</script>

<div id="prestige-holder">
    <div id="prestige-header"><p>PRESTIGE</p></div>
    <div id="prestige-content">
        <p class="prestige-token-convert-info">Unclaimed tokens — Prestige to collect.</p>

        <div id="prestige-token-holder">
            <CurrencyHolder image="src/lib/assets/images/icons/token.png" currency={prestigeTokensAbbr} textColor="#C645AF" nodesign={true} margin={8} />
        </div>

        <div id="prestige-info-screen">
            <h1>Find an acorn to prestige</h1>
            <img style="filter: brightness({canPrestige ? "1":"0"})" src="/src/lib/assets/images/items/acorn2.png" alt="">
            <p>{getItemDropChanceString("Acorn")} acorn drop chance</p>
        </div>

        <div id="prestige-content-controls">
            <button onclick={prestige} style="opacity: {canPrestige ? "1":"0.5"}">
                Prestige
                {#if !canPrestige}
                    <img class="button-lock" src="/src/lib/assets/images/icons/lock.png" alt="">
                {/if}
            </button>
            <button onclick={openPrestigeMenuHandler}>Open prestige upgrades</button>
        </div>
    </div>
</div>

<style>
    #prestige-holder {
        width: 350px;
        height: 660px;
        user-select: none;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        position: absolute;
        left: 50px;
        top: 50%;
        translate: 0 -50%;
    }

    #prestige-header {
        position: absolute;
        width: 100%;
        height: 50px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.9);
    }
    #prestige-header > p {
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

    #prestige-content {
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

    #prestige-token-holder {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #prestige-content-controls {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
    }

    #prestige-content-controls > button {
        cursor: pointer;
        background: #C645AF;
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        padding: 10px 20px;
        border: none;
        color: white;
        font-family: "Quicksand";
        font-weight: 700;
        transition: all 0.15s;
        width: 75%;
        font-size: 1rem;
    }
    #prestige-content-controls > button:last-child {
        margin-bottom: 25px;
    }
    #prestige-content-controls > button:hover {
        scale: 1.05;
    }
    #prestige-content-controls > button:active {
        scale: 0.95;
    }

    .button-lock {
        position: absolute;
        height: 95%;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
    }

    #prestige-info-screen {
        width: 90%;
        height: 200px;
        position: absolute;
        left: 50%;
        top: 45%;
        translate: -50% -50%;
    }
    #prestige-info-screen > h1 {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        text-align: center;
        font-size: 1.5rem;
        margin: 0;
    }
    #prestige-info-screen > img {
        height: 125px;
        position: relative;
        left: 50%;
        translate: -50%;
        margin-top: 5px;
        user-select: none;
        pointer-events: none;
    }
    #prestige-info-screen > p {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        margin: 0;
        text-align: center;
        margin-top: 5px;
    }

    .prestige-token-convert-info {
        color: white;
        margin: 0;
        font-weight: 700;
        font-family: "Quicksand";
        margin-top: 10px;
    }
</style>