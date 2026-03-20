<script lang="ts">
    import { data } from "$lib/utils/game_state"
    import { resolveCollectibles, type CollectableObject } from "./Collectibles.collectibles"

    import Collectible from "./Collectible.svelte"

    const { active } = $props()

    let frameElement: HTMLDivElement | null = $state(null)

    let collectibles: Array<CollectableObject> = $state([])
    let userCollectiblesCount: number = 0

    function setup(): void {
        collectibles = resolveCollectibles()

        data.subscribe(state => {
            if (state.collectibles.length !== userCollectiblesCount) {
                userCollectiblesCount = state.collectibles.length

                collectibles = resolveCollectibles()
            }
        })   
    }

    setup()
</script>

{#if active}
    <div class="collectibles-blur">
        <div class="collectibles-window">
            <h1>COLLECTIBLES</h1>
            <div class="collectibles-container" bind:this={frameElement}>
                {#each collectibles as collectable}
                    <Collectible collectibleObject={collectable} frameElement={frameElement} />
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .collectibles-blur {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .collectibles-window {
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        background: rgba(22, 22, 22, 0.95);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        width: 700px;
        height: 700px;
        z-index: 100;
    }
    .collectibles-window > h1 {
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

    .collectibles-container {
        width: 100%;
        height: calc(100% - 4rem);
        position: absolute;
        left: 0;
        top: 4rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        scale: 0.9;
    }
</style>