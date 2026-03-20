<script lang="ts">
    import { data } from "$lib/utils/game_state"
    import { resolveAchievements, handleAchievementProgress, type AchievementObject } from "./Achievements.render"

    import Achievement from "./Achievement.svelte"

    const { active } = $props()

    let achievements: Array<AchievementObject> = $state([])

    function setup(): void {
        achievements = resolveAchievements()

        data.subscribe(state => {
            handleAchievementProgress(state, achievements)
        })
    }

    setup()
</script>

{#if active}
    <div class="achievements-blur">
        <div class="achievements-window">
            <h1>ACHIEVEMENTS</h1>

            <div>
                {#each achievements as achievement}
                    <Achievement achData={achievement.data} ach={achievement.achievement} />
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .achievements-blur {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .achievements-window {
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
        position: relative;
    }
    .achievements-window > h1 {
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
    .achievements-window > div {
        position: absolute;
        width: 100%;
        top: 4rem;
        height: calc(100% - 5rem);
        overflow-y: scroll;
    }

    .achievements-window > div::-webkit-scrollbar {
        width: 5px;
    }
    .achievements-window > div::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 10px;
    }
    .achievements-window > div::-webkit-scrollbar-thumb {
        background-color: white;
        border-radius: 10px;
    }
</style>