<script lang="ts">
	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={"/images/leaves/0.png"} />
</svelte:head>

{@render children()}
