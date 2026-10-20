<script>
	import { page } from '$app/state';
	import { getProject } from '#lib/data/mock-projects';
	import { PROJECT_TABS, ADD_CONTENT_ITEMS } from '#lib/domain/constants';
	import Tabs from '#lib/components/ui/Tabs.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import ProjectHeader from '#lib/components/project/ProjectHeader.svelte';
	import WarningsBar from '#lib/components/project/WarningsBar.svelte';
	import DocsTab from '#lib/components/project/tabs/DocsTab.svelte';
	import EnvTab from '#lib/components/project/tabs/EnvTab.svelte';
	import CodeTab from '#lib/components/project/tabs/CodeTab.svelte';
	import NotesTab from '#lib/components/project/tabs/NotesTab.svelte';
	import DeployTab from '#lib/components/project/tabs/DeployTab.svelte';
	import CommandsTab from '#lib/components/project/tabs/CommandsTab.svelte';

	let project = $state(structuredClone(getProject(page.params.id ?? '')));
	let activeTab = $state('docs');

	/** @type {(name: string) => void} */
	function addEnv(name) {
		if (!project) return;
		project.environments.push({ id: `env-${Date.now()}`, name, url: '', vars: [] });
	}
	/** @type {(text: string) => void} */
	function addWarning(text) {
		if (!project) return;
		project.warnings.push({ id: `warn-${Date.now()}`, text });
	}
	/** @type {(id: string, done: boolean) => void} */
	function toggleChecklist(id, done) {
		if (!project) return;
		const item = project.checklist.find((c) => c.id === id);
		if (item) item.done = done;
	}
</script>

{#if project}
	<div class="page flat-bg project">
		<ProjectHeader {project} addItems={ADD_CONTENT_ITEMS} onadd={(tab) => (activeTab = tab)} />
		<WarningsBar warnings={project.warnings} onadd={addWarning} />
		<Tabs tabs={PROJECT_TABS} bind:active={activeTab} />
		<main class="content">
			{#if activeTab === 'docs'}
				<DocsTab docs={project.docs} />
			{:else if activeTab === 'env'}
				<EnvTab environments={project.environments} onaddenv={addEnv} />
			{:else if activeTab === 'code'}
				<CodeTab files={project.codeFiles} />
			{:else if activeTab === 'notas'}
				<NotesTab entries={project.bitacora} />
			{:else if activeTab === 'deploy'}
				<DeployTab dependencies={project.dependencies} checklist={project.checklist} ontoggle={toggleChecklist} />
			{:else}
				<CommandsTab commands={project.commands} quickLinks={project.quickLinks} />
			{/if}
		</main>
	</div>
{:else}
	<div class="page flat-bg not-found">
		<p>Proyecto no encontrado.</p>
		<Button href="/">← Volver a la constelación</Button>
	</div>
{/if}

<style>
	.project {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px 48px;
	}
	.content {
		flex: 1;
	}
	.not-found {
		align-items: center;
		justify-content: center;
		gap: 16px;
		text-align: center;
	}
</style>
