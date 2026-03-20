<script lang="ts">
	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={"/src/lib/assets/images/leaves/0.png"} />
</svelte:head>

{@render children()}
