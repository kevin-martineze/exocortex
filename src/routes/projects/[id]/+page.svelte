<script>
	import { page } from '$app/state';
	import { getProject } from '#lib/data/mock-projects';
	import { CLUSTERS, STATUS, ROLES } from '#lib/domain/constants';
	import { copyText } from '#lib/utils/clipboard';
	import { envBlock } from '#lib/domain/project';
	import Badge from '#lib/components/ui/Badge.svelte';
	import CopyButton from '#lib/components/ui/CopyButton.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import Tabs from '#lib/components/ui/Tabs.svelte';
	import SplitPane from '#lib/components/ui/SplitPane.svelte';
	import NavList from '#lib/components/ui/NavList.svelte';
	import Menu from '#lib/components/ui/Menu.svelte';

	let project = $state(structuredClone(getProject(page.params.id)));

	if (project) {
		project.warnings ??= [];
		project.dependencies ??= [];
		project.checklist ??= [];
	}

	const TABS = [
		{ id: 'docs', label: 'Docs' },
		{ id: 'env', label: 'Variables de entorno' },
		{ id: 'code', label: 'Preview de código' },
		{ id: 'deploy', label: 'Deploy' },
		{ id: 'notas', label: 'Notas' },
		{ id: 'comandos', label: 'Comandos y enlaces' }
	];

	const ADD_ITEMS = [
		{ label: 'Variable de entorno', onselect: () => selectTab('env') },
		{ label: 'Documento (Markdown)', onselect: () => selectTab('docs') },
		{ label: 'Nota de bitácora', onselect: () => selectTab('notas') },
		{ label: 'Comando frecuente', onselect: () => selectTab('comandos') },
		{ label: 'Enlace rápido', onselect: () => selectTab('comandos') }
	];

	let activeTab = $state('docs');
	let activeDocId = $state(project?.docs[0]?.id ?? null);
	let activeFileId = $state(project?.codeFiles[0]?.id ?? null);
	let newEnvOpen = $state(false);
	let newEnvName = $state('');
	let warnOpen = $state(false);
	let warnText = $state('');

	let activeDoc = $derived(
		project?.docs.find((d) => d.id === activeDocId) ?? project?.docs[0] ?? null
	);
	let activeFile = $derived(
		project?.codeFiles.find((f) => f.id === activeFileId) ?? project?.codeFiles[0] ?? null
	);
	let docItems = $derived(project?.docs.map((d) => ({ id: d.id, label: d.title })) ?? []);
	let codeItems = $derived(project?.codeFiles.map((f) => ({ id: f.id, label: f.path })) ?? []);
	let notasMd = $derived(
		(project?.bitacora ?? []).map((b) => `### ${b.date}\n\n${b.text}`).join('\n\n')
	);
	let doneCount = $derived((project?.checklist ?? []).filter((c) => c.done).length);

	function selectTab(tab) {
		activeTab = tab;
	}

	function addEnv() {
		const name = newEnvName.trim();
		if (!name) return;
		project.environments.push({ id: `env-${Date.now()}`, name, url: '', vars: [] });
		newEnvName = '';
		newEnvOpen = false;
	}

	function addWarning() {
		const text = warnText.trim();
		if (!text) return;
		project.warnings.push({ id: `warn-${Date.now()}`, text });
		warnText = '';
		warnOpen = false;
	}
</script>

{#if project}
	<div class="page flat-bg project">
		<header class="project-header">
			<a class="back" href="/">← Constelación</a>
			<div class="title-row">
				<h1 class="title">{project.title}</h1>
				<div class="badges">
					<Badge label={CLUSTERS[project.cluster].label} color={CLUSTERS[project.cluster].color} />
					{#if project.role}<Badge label={ROLES[project.role]} />{/if}
					<Badge label={STATUS[project.status].label} color={STATUS[project.status].color} />
					{#if project.locked}<Badge label="Bloqueado" color="#e06a6a" />{/if}
					{#if project.health}
						<span class="health" class:down={!project.health.up}>
							<span class="health-dot" aria-hidden="true"></span>
							{project.health.up ? 'Operativo' : 'Caído'} · {project.health.lastChecked}
						</span>
					{/if}
				</div>
			</div>
			<div class="add-wrap">
				<Menu label="+ Agregar contenido" items={ADD_ITEMS} />
			</div>
		</header>

		<section class="warnings" aria-label="Advertencias fijadas">
			<div class="warnings-head">
				<span class="warnings-title">Advertencias fijadas</span>
				<Button size="sm" onclick={() => (warnOpen = !warnOpen)}>+ Fijar advertencia</Button>
			</div>
			{#if project.warnings.length}
				<ul class="warnings-list">
					{#each project.warnings as w (w.id)}
						<li class="warning">⚠️ {w.text}</li>
					{/each}
				</ul>
			{:else}
				<p class="muted warnings-empty">Sin advertencias fijadas.</p>
			{/if}
			{#if warnOpen}
				<div class="new-warning">
					<Input
						style="flex: 1"
						placeholder="Advertencia (ej. no tocar X sin leer Y)"
						bind:value={warnText}
					/>
					<Button variant="primary" onclick={addWarning}>Agregar</Button>
				</div>
			{/if}
		</section>

		<Tabs tabs={TABS} bind:active={activeTab} />

		<main class="content">
			{#if activeTab === 'docs'}
				<SplitPane>
					{#snippet side()}
						<NavList items={docItems} bind:active={activeDocId} empty="Sin documentos todavía." />
					{/snippet}
					{#if activeDoc}
						<div class="pane-head">
							<h2 class="pane-title">{activeDoc.title}</h2>
							<Button onclick={() => copyText(activeDoc.content, 'Documento')}>
								Copiar como Markdown
							</Button>
						</div>
						<pre class="markdown">{activeDoc.content}</pre>
					{/if}
				</SplitPane>
			{:else if activeTab === 'env'}
				<div class="env-tab">
					<div class="env-head">
						<h2 class="pane-title">Entornos</h2>
						<Button onclick={() => (newEnvOpen = !newEnvOpen)}>+ Entorno</Button>
					</div>

					{#if newEnvOpen}
						<div class="new-env">
							<Input
								style="flex: 1"
								placeholder="Nombre del entorno (ej. Demo)"
								bind:value={newEnvName}
							/>
							<Button variant="primary" onclick={addEnv}>Agregar</Button>
						</div>
					{/if}

					{#each project.environments as env (env.id)}
						<Card>
							<div class="env-card-head">
								<h3 class="env-name">{env.name}</h3>
								{#if env.url}<span class="mono muted">{env.url}</span>{/if}
								{#if env.vars?.length}
									<Button
										size="sm"
										style="margin-left: auto"
										onclick={() => copyText(envBlock(env), `.env de ${env.name}`)}
									>
										Copiar todo el .env de {env.name}
									</Button>
								{/if}
							</div>
							{#if env.vars?.length}
								<div class="vars">
									{#each env.vars as v (v.id)}
										<div class="var-row">
											<span class="key mono">{v.key}</span>
											<span class="value mono">••••••••••</span>
											<CopyButton
												value={v.value}
												toast="Variable de entorno"
												ariaLabel={`Copiar ${v.key}`}
											/>
										</div>
									{/each}
								</div>
							{:else}
								<p class="muted empty">Sin variables todavía en {env.name}.</p>
							{/if}
						</Card>
					{:else}
						<p class="muted empty">Sin entornos todavía.</p>
					{/each}
				</div>
			{:else if activeTab === 'code'}
				<SplitPane>
					{#snippet side()}
						<NavList
							items={codeItems}
							mono
							bind:active={activeFileId}
							empty="Sin archivos todavía."
						/>
					{/snippet}
					{#if activeFile}
						<div class="pane-head">
							<h2 class="pane-title mono">{activeFile.path}</h2>
						</div>
						<pre class="code"><code>{activeFile.snippet}</code></pre>
					{/if}
				</SplitPane>
			{:else if activeTab === 'notas'}
				<div class="notas-tab">
					<div class="pane-head">
						<h2 class="pane-title">Bitácora</h2>
						<Button onclick={() => copyText(notasMd, 'Bitácora')}>Copiar como Markdown</Button>
					</div>
					{#each project.bitacora as b (b.id)}
						<article class="nota">
							<span class="mono nota-date">{b.date}</span>
							<p class="nota-text">{b.text}</p>
						</article>
					{:else}
						<p class="muted empty">Sin notas todavía.</p>
					{/each}
				</div>
			{:else if activeTab === 'deploy'}
				<div class="deploy-tab">
					<Card>
						<h2 class="pane-title">Dependencias críticas</h2>
						{#each project.dependencies as dep (dep.id)}
							<div class="dep">
								<div class="dep-head">
									<span class="dep-name">{dep.name}</span>
									<span class="mono dep-version">{dep.version}</span>
								</div>
								<p class="dep-reason">{dep.reason}</p>
							</div>
						{:else}
							<p class="muted empty">Sin dependencias críticas registradas.</p>
						{/each}
					</Card>

					<Card>
						<div class="deploy-card-head">
							<h2 class="pane-title">Checklist de deploy</h2>
							<span class="muted">{doneCount} de {project.checklist.length} listos</span>
						</div>
						{#each project.checklist as c (c.id)}
							<div class="check-item">
								<Checkbox bind:checked={c.done} strike>{c.text}</Checkbox>
							</div>
						{:else}
							<p class="muted empty">Sin checklist registrado.</p>
						{/each}
					</Card>
				</div>
			{:else}
				<div class="comandos-tab">
					<section>
						<h2 class="pane-title">Comandos frecuentes</h2>
						{#each project.commands as c (c.id)}
							<div class="cmd-row">
								<span class="cmd-label">{c.label}</span>
								<code class="cmd mono">{c.command}</code>
								<CopyButton value={c.command} toast="Comando" ariaLabel={`Copiar ${c.label}`} />
							</div>
						{:else}
							<p class="muted empty">Sin comandos todavía.</p>
						{/each}
					</section>

					<section>
						<h2 class="pane-title">Enlaces rápidos</h2>
						<div class="quick-links">
							{#each project.quickLinks as l (l.id)}
								<a class="quick-link" href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
							{:else}
								<p class="muted empty">Sin enlaces todavía.</p>
							{/each}
						</div>
					</section>
				</div>
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

	.content {
		flex: 1;
	}

	.pane-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
		flex-wrap: wrap;
	}
	.pane-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}
	.markdown {
		white-space: pre-line;
		font-family: var(--font-sans);
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0;
	}
	.code {
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		border-radius: var(--radius-sm);
		padding: 16px;
		overflow-x: auto;
		font-size: 13px;
		line-height: 1.55;
		color: var(--text-primary);
		margin: 0;
	}

	.env-tab,
	.notas-tab,
	.comandos-tab {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.env-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.new-env {
		display: flex;
		gap: 10px;
	}
	.env-card-head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 14px;
		flex-wrap: wrap;
	}
	.env-name {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
	}
	.vars {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.var-row {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		border-radius: var(--radius-sm);
		padding: 9px 12px;
	}
	.key {
		flex: 1;
		min-width: 0;
		font-size: 13px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.value {
		font-size: 13px;
		color: var(--text-very-faint);
		letter-spacing: 1px;
	}

	.nota {
		border-bottom: 1px solid var(--border-panel);
		padding: 14px 0;
	}
	.nota:last-child {
		border-bottom: none;
	}
	.nota-date {
		font-size: 12px;
		color: var(--text-faint);
	}
	.nota-text {
		margin: 6px 0 0;
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.cmd-row {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-md);
		padding: 12px 14px;
		margin-bottom: 8px;
	}
	.cmd-label {
		flex: 1;
		font-size: 14px;
	}
	.cmd {
		font-size: 13px;
		color: var(--text-faint);
		background: var(--bg-input);
		padding: 4px 8px;
		border-radius: 6px;
	}
	.quick-links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.quick-link {
		padding: 9px 14px;
		border: 1px solid var(--border-input);
		background: var(--bg-ghost);
		border-radius: var(--radius-md);
		font-size: 14px;
		color: var(--text-ghost);
	}
	.quick-link:hover {
		border-color: var(--border-hover);
		color: var(--text-primary);
	}

	.health {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-secondary);
		padding: 4px 10px;
		border: 1px solid var(--border-panel);
		border-radius: 999px;
		background: var(--bg-panel);
		white-space: nowrap;
	}
	.health-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--status-activo);
		animation: pulse 2s ease-in-out infinite;
	}
	.health.down .health-dot {
		background: var(--status-bloqueado);
		animation: none;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(124, 197, 143, 0.6);
		}
		50% {
			box-shadow: 0 0 0 5px rgba(124, 197, 143, 0);
		}
	}

	.warnings {
		margin-bottom: 20px;
		padding: 14px 16px;
		background: rgba(224, 106, 106, 0.1);
		border: 1px solid rgba(224, 106, 106, 0.25);
		border-left: 3px solid var(--status-bloqueado);
		border-radius: var(--radius-md);
	}
	.warnings-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 8px;
		flex-wrap: wrap;
	}
	.warnings-title {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #e88787;
	}
	.warnings-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.warning {
		font-size: 14px;
		color: var(--text-primary);
		line-height: 1.5;
	}
	.warnings-empty {
		font-size: 13px;
	}
	.new-warning {
		display: flex;
		gap: 10px;
		margin-top: 12px;
	}

	.deploy-tab {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		align-items: start;
	}
	.deploy-card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
	}
	.dep {
		padding: 12px 0;
		border-bottom: 1px solid var(--border-panel);
	}
	.dep:last-child {
		border-bottom: none;
	}
	.dep-head {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}
	.dep-name {
		font-size: 14px;
		font-weight: 600;
	}
	.dep-version {
		font-size: 12.5px;
		color: var(--accent-personal);
	}
	.dep-reason {
		margin: 4px 0 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-secondary);
	}
	.check-item {
		padding: 9px 0;
	}

	.empty {
		padding: 12px 0;
	}
	.not-found {
		align-items: center;
		justify-content: center;
		gap: 16px;
		text-align: center;
	}

	@media (max-width: 760px) {
		.deploy-tab {
			grid-template-columns: 1fr;
		}
	}
</style>
