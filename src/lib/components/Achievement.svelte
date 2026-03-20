<script lang="ts">
    import { abbrNumber, abbrTimeNumber } from "$lib/utils/abbr"

    const { achData, ach } = $props()

    let progressPercentage: number = $derived((100 / ach.reqAmount) * achData.progress)
</script>

<div class="ach-holder">
    <div class="ach-img-holder">
        <img src="/images/icons/{ach.image}" alt="">
    </div>
    <div class="ach-content-holder">
        <h1>{ach.name}</h1>
        <h2>{ach.desc}</h2>
        <p>{ach.boostText}</p>
        <div class="ach-main-bar">
            <div class="ach-bar" style="width: {progressPercentage}%"></div>
            <p style="display: {progressPercentage >= 100 ? "none":"block"}">
                {ach.reqType === "time" ? abbrTimeNumber(achData.progress):abbrNumber(achData.progress)}/{ach.reqType === "time" ? abbrTimeNumber(ach.reqAmount):abbrNumber(ach.reqAmount)}
            </p>
            <p style="display: {progressPercentage >= 100 ? "block":"none"}">
                Completed
            </p>
        </div>
    </div>
</div>

<style>
    .ach-holder {
        width: 90%;
        height: 150px;
        position: relative;
        left: 50%;
        translate: -50%;
        margin-top: 10px;
        margin-bottom: 10px;
        background: rgba(11, 11, 11, 0.95);
        border-radius: 14px;
        backdrop-filter: blur(6px);
    }
    
    .ach-img-holder {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        aspect-ratio: 1/1;
    }
    .ach-img-holder > img {
        width: 100%;
        height: 100%;
        user-select: none;
        pointer-events: none;
        scale: 0.9;
    }

    .ach-content-holder {
        height: 100%;
        width: 75%;
        left: 25%;
        position: absolute;
        top: 0;
    }
    .ach-content-holder > h1 {
        color: white;
        font-weight: 700;
        font-family: "Quicksand";
        user-select: none;
        pointer-events: none;
        text-transform: uppercase;
        position: absolute;
        top: 5px;
        margin: 0;
    }
    .ach-content-holder > h2 {
        color: white;
        font-family: "Quicksand";
        font-weight: 700;
        position: absolute;
        top: 20%;
        left: 50%;
        translate: -50%;
        user-select: none;
        pointer-events: none;
        width: 100%;
        text-align: center;
    }
    .ach-content-holder > p {
        color: white;
        font-family: "Quicksand";
        font-weight: 700;
        position: absolute;
        bottom: 0;
        left: 50%;
        translate: -50%;
        user-select: none;
        pointer-events: none;
    }

    .ach-main-bar {
        position: absolute;
        width: 100%;
        height: 25px;
        top: 55%;
        border-radius: 14px;
        background-color: black;
        user-select: none;
        pointer-events: none;
        scale: 0.98;
    }
    .ach-main-bar > p {
        color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        margin: 0;
        font-family: "Quicksand";
        font-weight: 700;
    }
    .ach-bar {
        background-color: green;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 14px;
    }
</style>