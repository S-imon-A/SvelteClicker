<script lang="ts">
    import type { LeafData } from "./Tree.leaves"

    export let data: LeafData
    export let image: string

    export let onHover: (e: PointerEvent, d: LeafData) => void
</script>

<img
    src="/{image}" 
    alt=""
    style="left: {data.x}px; top: {data.y}px; rotate: {data.r}deg; scale: {data.s}; pointer-events: {data.clickable ? "auto":"none"}; filter: brightness({data.brightness})"
    onpointerenter={(e) => { onHover(e, data) }}
>

<style>
    img {
        position: absolute;
        width: 50px;
        translate: -50% -50%;
        user-select: none;
    }
</style>