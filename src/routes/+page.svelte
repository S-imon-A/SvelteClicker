<script lang="ts">
    import { data, loadUserData, saveUserData } from "$lib/utils/game_state"
    import { abbrNumber, abbrTimeNumber } from "$lib/utils/abbr"
    import { getNextLevelXPNeeded } from "$lib/utils/level"

    import Tree from "$lib/components/Tree.svelte"
    import CurrencyHolder from "$lib/components/CurrencyHolder.svelte"
    import Levelbar from "$lib/components/Levelbar.svelte"
    import Shop from "$lib/components/Shop.svelte"
    import PrestigeMenu from "$lib/components/PrestigeMenu.svelte"
    import PrestigeUpgrades from "$lib/components/PrestigeUpgrades.svelte"
    import Collectibles from "$lib/components/Collectibles.svelte"
    import CheatWindow from "$lib/components/CheatWindow.svelte"
    import Achievements from "$lib/components/Achievements.svelte"

    let mainCurrencyHolder: HTMLDivElement | null
    let mainCurrency: number = $state(0)
    let mainCurrencyAbbr: string = $derived(abbrNumber(mainCurrency))

    let level: number = $state(1)
    let displayedLevel: string = $derived(abbrNumber(level))
    let xp: number = $state(0)
    let neededXP: number = $derived(getNextLevelXPNeeded(level - 1))
    let progress: number = $derived((100 / neededXP) * xp)

    let prestigeUpgradesMenuVisible: boolean = $state(false)
    let canPrestige: boolean = false
    let prestigeLeavesReset: boolean = false
    let prestigeUpgradesReset: boolean = false

    let collectiblesActive: boolean = $state(false)
    let achievementsActive: boolean = $state(false)

    let playtime: number = $state(0)
    let playtimeAbbr: string = $derived(abbrTimeNumber(playtime))

    let cheatWindowActive: boolean = $state(false)

    function getMainCurrencyRect(): DOMRect | null {
        return mainCurrencyHolder?.getBoundingClientRect() || null
    }

    function closePrestigeUpgradesMenu(): void {
        prestigeUpgradesMenuVisible = false
    }

    function openPrestigeUpgradesMenu(): void {
        prestigeUpgradesMenuVisible = true
    }

    function checkLeavesReset(): boolean {
        if (prestigeLeavesReset) {
            prestigeLeavesReset = false

            return true
        }

        return false
    }

    function checkUpgradesReset(): boolean {
        if (prestigeUpgradesReset) {
            prestigeUpgradesReset = false

            return true
        }

        return false
    }

    function prestige(): void {
        if (!canPrestige) return

        prestigeLeavesReset = true
        prestigeUpgradesReset = true

        data.update(state => {
            state.coins = 0
            state.clickPower = 0
            state.passiveClickPower = 0
            state.clickMulti = 1
            state.passiveClickMulti = 1
            state.criticalHitChance = 0
            state.criticalHitPower = 1
            state.tree.id = 0
            state.tree.currentHealth = 0
            state.tree.leaves = []
            state.tree.collectedLeaves = []
            state.tree.upgrades = []
            state.tree.currentLeafCost = 0
            state.tree.currentLeafMulti = 1
            state.tree.ownedTrees = [0]
            state.upgrades = []
            state.level = 1
            state.xp = 0
            state.xpExtra = 0
            state.xpMulti = 1
            state.passiveClickSpeed = 1_000
            state.canPrestige = false

            state.skillTokens += state.runSkillTokens
            state.runSkillTokens = 0
            state.achievementTracking.totalPrestiges++

            return state
        })
    }

    function collectiblesButton(): void {
        achievementsActive = false

        collectiblesActive = !collectiblesActive
    }

    function achievementsButton(): void {
        collectiblesActive = false

        achievementsActive = !achievementsActive
    }

    function setup(): void {
        loadUserData()
        saveUserData()

        data.subscribe(state => {
            mainCurrency = state.coins
            level = state.level
            xp = state.xp
            canPrestige = state.canPrestige
            playtime = state.playtime

            if (level > state.achievementTracking.toplevel) {
                data.update(_state => {
                    _state.achievementTracking.toplevel = level

                    return _state
                })
            }

            if (xp >= neededXP) {
                const xpOverflow: number = xp - neededXP

                data.update(_state => {
                    _state.xp = xpOverflow
                    _state.level += 1
                    _state.achievementTracking.levelsGained++
                    
                    if (_state.level <= 10) {
                        _state.runSkillTokens += 1
                    }
                    else if (_state.level <= 20) {
                        _state.runSkillTokens += 2
                    }
                    else if (_state.level <= 30) {
                        _state.runSkillTokens += 3
                    }
                    else {
                        _state.runSkillTokens += 4
                    }

                    return _state
                })
            }
        })

        setInterval(() => {
            data.update(state => {
                state.playtime += 1

                return state
            })
        }, 1_000)
    }

    setup()
</script>

<img id="background" src="/images/background/background.png" alt="">

<Tree getMainCurrencyRect={getMainCurrencyRect} checkPrestigeLeavesReset={checkLeavesReset} />

<div id="main-currency" bind:this={mainCurrencyHolder}>
    <CurrencyHolder image="images/leaves/0.png" currency={mainCurrencyAbbr} textColor="#EA4F36" nodesign={false} margin={0} />
</div>

<div id="time-holder">
    <CurrencyHolder image="images/icons/clock.png" currency={playtimeAbbr} textColor="#4C67FF" nodesign={false} margin={10} />
</div>

<Levelbar level={displayedLevel} progress={progress} reqCur={xp} reqMax={neededXP} />

<Shop checkPrestigeUpgradesReset={checkUpgradesReset} />

<PrestigeMenu openPrestigeMenuHandler={openPrestigeUpgradesMenu} prestige={prestige} />

<PrestigeUpgrades visible={prestigeUpgradesMenuVisible} exitHandler={closePrestigeUpgradesMenu} />

<div class="bottom-buttons">
    <button 
        style="display: {prestigeUpgradesMenuVisible ? "none":"block"}; opacity: {achievementsActive ? "0.4":"1"}"
        onclick={collectiblesButton}
        class="collectibles-button"
        >
        Collectibles
    </button>
    <button 
        style="display: {prestigeUpgradesMenuVisible ? "none":"block"}; opacity: {collectiblesActive ? "0.4":"1"}"
        onclick={achievementsButton}
        class="achievements-button"
        >
        Achievements
    </button>
</div>

<Collectibles active={collectiblesActive} />
<Achievements active={achievementsActive} />

<CheatWindow active={cheatWindowActive} />
<svelte:window onkeydown={(e) => {if (e.key === "c") { cheatWindowActive = !cheatWindowActive }}} />

<style>
    #main-currency {
        position: absolute;
        right: 50px;
        top: 50px;
    }

    #time-holder {
        position: absolute;
        left: 50px;
        top: 50px;
    }

    #background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        user-select: none;
    }

    .bottom-buttons {
        position: absolute;
        left: 50%;
        translate: -50%;
        bottom: 5%;
        display: flex;
        width: 600px;
        align-items: center;
        justify-content: center;
        gap: 10px;
        z-index: 101;
    }

    .collectibles-button, .achievements-button {
        font-size: 1.5rem;
        font-weight: 700;
        font-family: "Quicksand";
        color: white;
        padding: 10px 20px;
        background: rgba(22, 22, 22, 0.85);
        border: 2px solid rgba(0, 0, 0, 0.9);
        border-radius: 14px;
        backdrop-filter: blur(6px);
        cursor: pointer;
        transition: all 0.15s;
    }
    .collectibles-button:hover, .achievements-button:hover {
        scale: 1.05;
    }
    .collectibles-button:active, .achievements-button:active {
        scale: 0.95;
    }
</style>