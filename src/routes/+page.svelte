<script>
	import { getProjects } from '#lib/data/mock-projects';
	import Stars from '#lib/components/constellation/Stars.svelte';
	import Constellation from '#lib/components/constellation/Constellation.svelte';
	import HomeTopbar from '#lib/components/constellation/HomeTopbar.svelte';
	import Legend from '#lib/components/constellation/Legend.svelte';
	import ProjectPanel from '#lib/components/project/ProjectPanel.svelte';
	import CommandPalette from '#lib/components/search/CommandPalette.svelte';
	import Fab from '#lib/components/ui/Fab.svelte';

	const projects = getProjects();

	/** @type {import('#lib/domain/types.js').Project | null} */
	let selected = $state(null);
	let paletteOpen = $state(false);
</script>

<div class="page cosmic-bg home">
	<Stars />
	<HomeTopbar onsearch={() => (paletteOpen = true)} />
	<Constellation
		{projects}
		selectedId={selected?.id ?? null}
		onselect={(p) => (selected = p)}
		keyboard={!paletteOpen}
		panelOpen={!!selected}
	/>
	<Legend />
	<Fab href="/projects/new" label="Agregar proyecto" />
	{#if selected}
		<ProjectPanel project={selected} onclose={() => (selected = null)} />
	{/if}
	<CommandPalette bind:open={paletteOpen} {projects} />
</div>

<style>
	.home {
		position: relative;
		overflow: hidden;
	}
</style>
