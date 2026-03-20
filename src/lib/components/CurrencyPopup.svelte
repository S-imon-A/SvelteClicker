<script lang="ts">
    const { currency, textColor, x, y } = $props()
</script>

<p style="color: {textColor}; left: {x}px; top: {y}px">+{currency}</p>

<style>
    p {
        position: absolute;
        translate: -50% -50%;
        margin: 0;
        font-family: "Quicksand";
        font-weight: 700;
        font-size: 1.2rem;
    }
</style>