<script lang="ts">
    import PrestigeUpgradeInstance from "./PrestigeUpgradeInstance.svelte"

    const { columns, categoryName } = $props()

    let columnElement: HTMLDivElement | null = $state(null)
</script>

<div class="upgrade-column" bind:this={columnElement}>
    <div class="upgrade-container">
        {#each columns as column}
            <div class="upgrade-container-column">
                {#each column as upgrade}
                    <PrestigeUpgradeInstance prestigeUpgradeObject={upgrade} prestigeUpgrade={upgrade.upgrade} prestigeUpgradeData={upgrade.data} columnElement={columnElement} />
                {/each}
            </div>
        {/each}
    </div>

    <p class="upgrade-column-name">{categoryName.toUpperCase()}</p>
</div>

<style>
    .upgrade-column {
        height: 100%;
        width: 300px;
        position: relative;
    }

    .upgrade-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 300px;
        height: 92.5%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .upgrade-column-name {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        font-size: 1.5rem;
        position: absolute;
        left: 50%;
        translate: -50%;
        bottom: 1.5%;
        margin: 0;
        user-select: none;
        pointer-events: none;
    }

    .upgrade-container-column {
        width: 30%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column-reverse;
        gap: 10px;
    }
</style>