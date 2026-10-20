<script>
	import { CLUSTERS, STATUS, ROLES } from '#lib/domain/constants';
	import Badge from '../ui/Badge.svelte';

	/** @typedef {import('#lib/domain/types.js').Project} Project */

	/** @type {{ project: Project }} */
	let { project } = $props();
</script>

<div class="badges">
	<Badge label={CLUSTERS[project.cluster].label} color={CLUSTERS[project.cluster].color} />
	{#if project.role}
		<Badge label={ROLES[project.role]} />
	{/if}
	<Badge label={STATUS[project.status].label} color={STATUS[project.status].color} />
	{#if project.locked}
		<Badge label="Bloqueado" color="var(--status-bloqueado)" />
	{/if}
</div>

<style>
	.badges {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
</style>
