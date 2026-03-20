<script lang="ts">
    import { abbrNumber } from "$lib/utils/abbr"
    import { data } from "$lib/utils/game_state"
    import { resolvePrestigeUpgrades, type PrestigeUpgradeCategory } from "./PrestigeUpgrades.render"

    import PrestigeUpgradeColumn from "./PrestigeUpgradeColumn.svelte"
    import CurrencyHolder from "./CurrencyHolder.svelte"

    const { visible, exitHandler } = $props()

    let prestigeTokens: number = $state(0)
    let prestigeTokensAbbr: string = $derived(abbrNumber(prestigeTokens))
    let prevPrestigeTokens: number = 0

    let prestigeUpgradeCategories: Array<PrestigeUpgradeCategory> = $state([])

    function setup() {
        prestigeUpgradeCategories = resolvePrestigeUpgrades()

        data.subscribe(state => {
            prestigeTokens = state.skillTokens

            if (prevPrestigeTokens !== prestigeTokens) {
                prevPrestigeTokens = prestigeTokens

                prestigeUpgradeCategories = resolvePrestigeUpgrades()
            }
        })
    }

    setup()
</script>

{#if visible}
    <div id="prestige-upgrades-menu">
        <div id="prestige-upgrades-container">
            {#each prestigeUpgradeCategories as category}
                <PrestigeUpgradeColumn columns={category.data} categoryName={category.name} />
            {/each}
        </div>

        <button onclick={exitHandler} id="prestige-upgrades-exit">Exit</button>
    </div>

    <div id="prestige-token-info-holder">
        <CurrencyHolder image="src/lib/assets/images/icons/token.png" currency={prestigeTokensAbbr} textColor="#C645AF" nodesign={false} margin={8} />
    </div>
{/if}

<style>
    #prestige-upgrades-menu {
        position: absolute;
        left: 0;
        top: 0;
        background-image: url("src/lib/assets/images/background/background.png");
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    #prestige-upgrades-exit {
        cursor: pointer;
        background: red;
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        padding: 10px 20px;
        border: none;
        color: white;
        font-family: "Quicksand";
        font-weight: 700;
        transition: all 0.15s;
        width: 125px;
        font-size: 1rem;
        position: absolute;
        bottom: 2.5%;
        left: 50%;
        translate: -50%;
    }
    #prestige-upgrades-exit:hover {
        scale: 1.05;
    }
    #prestige-upgrades-exit:active {
        scale: 0.95;
    }

    #prestige-upgrades-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 90%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 50px;
    }

    #prestige-token-info-holder {
        position: absolute;
        right: 50px;
        top: 50px;
        z-index: 25;
    }
</style>