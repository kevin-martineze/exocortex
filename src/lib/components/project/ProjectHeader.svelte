<script>
	import ProjectBadges from './ProjectBadges.svelte';
	import HealthBadge from './HealthBadge.svelte';
	import Menu from '../ui/Menu.svelte';

	/** @typedef {import('#lib/domain/types.js').Project} Project */

	/** @type {{ project: Project, addItems: { label: string, tab: string }[], onadd: (tab: string) => void }} */
	let { project, addItems, onadd } = $props();

	let items = $derived(addItems.map((i) => ({ label: i.label, onselect: () => onadd(i.tab) })));
</script>

<header class="project-header">
	<a class="back" href="/">← Constelación</a>
	<div class="title-row">
		<h1 class="title">{project.title}</h1>
		<div class="badges">
			<ProjectBadges {project} />
			{#if project.health}
				<HealthBadge health={project.health} />
			{/if}
		</div>
	</div>
	<div class="add-wrap">
		<Menu label="+ Agregar contenido" {items} />
	</div>
</header>

<style>
	.project-header {
		padding: 20px 0 16px;
		position: relative;
	}
	.back {
		font-size: 13px;
		color: var(--text-faint);
	}
	.back:hover {
		color: var(--accent-personal);
	}
	.title-row {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 12px;
		flex-wrap: wrap;
	}
	.title {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
	}
	.badges {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.add-wrap {
		position: absolute;
		top: 20px;
		right: 0;
	}
</style>
