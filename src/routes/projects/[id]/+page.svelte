<script>
	import { page } from '$app/state';
	import { getProject, CLUSTERS, STATUS, ROLES } from '#lib/mockData';
	import { copyText, envBlock } from '#lib/copy';
	import Badge from '#lib/components/Badge.svelte';
	import CopyButton from '#lib/components/CopyButton.svelte';

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
		{ label: 'Variable de entorno', tab: 'env' },
		{ label: 'Documento (Markdown)', tab: 'docs' },
		{ label: 'Nota de bitácora', tab: 'notas' },
		{ label: 'Comando frecuente', tab: 'comandos' },
		{ label: 'Enlace rápido', tab: 'comandos' }
	];

	let activeTab = $state('docs');
	let menuOpen = $state(false);
	let activeDocId = $state(null);
	let activeFileId = $state(null);
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
	let notasMd = $derived(
		(project?.bitacora ?? []).map((b) => `### ${b.date}\n\n${b.text}`).join('\n\n')
	);
	let doneCount = $derived((project?.checklist ?? []).filter((c) => c.done).length);

	function selectTab(tab) {
		activeTab = tab;
		menuOpen = false;
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
				<button class="btn btn-ghost" onclick={() => (menuOpen = !menuOpen)}>+ Agregar contenido</button>
				{#if menuOpen}
					<div class="menu" role="menu">
						{#each ADD_ITEMS as item}
							<button class="menu-item" role="menuitem" onclick={() => selectTab(item.tab)}>
								{item.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</header>

		<section class="warnings" aria-label="Advertencias fijadas">
			<div class="warnings-head">
				<span class="warnings-title">Advertencias fijadas</span>
				<button class="btn btn-ghost small" onclick={() => (warnOpen = !warnOpen)}>+ Fijar advertencia</button>
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
					<input
						class="input"
						type="text"
						placeholder="Advertencia (ej. no tocar X sin leer Y)"
						bind:value={warnText}
					/>
					<button class="btn btn-primary" onclick={addWarning}>Agregar</button>
				</div>
			{/if}
		</section>

		<nav class="tabs" role="tablist">
			{#each TABS as t}
				<button
					class="tab"
					class:active={activeTab === t.id}
					role="tab"
					aria-selected={activeTab === t.id}
					onclick={() => (activeTab = t.id)}
				>
					{t.label}
				</button>
			{/each}
		</nav>

		<main class="content">
			{#if activeTab === 'docs'}
				<div class="two-pane">
					<div class="side">
						{#each project.docs as d (d.id)}
							<button
								class="side-item"
								class:active={activeDoc?.id === d.id}
								onclick={() => (activeDocId = d.id)}
							>
								{d.title}
							</button>
						{:else}
							<p class="muted empty">Sin documentos todavía.</p>
						{/each}
					</div>
					<div class="pane">
						{#if activeDoc}
							<div class="pane-head">
								<h2 class="pane-title">{activeDoc.title}</h2>
								<button class="btn btn-ghost" onclick={() => copyText(activeDoc.content, 'Documento')}>
									Copiar como Markdown
								</button>
							</div>
							<pre class="markdown">{activeDoc.content}</pre>
						{/if}
					</div>
				</div>
			{:else if activeTab === 'env'}
				<div class="env-tab">
					<div class="env-head">
						<h2 class="pane-title">Entornos</h2>
						<button class="btn btn-ghost" onclick={() => (newEnvOpen = !newEnvOpen)}>+ Entorno</button>
					</div>

					{#if newEnvOpen}
						<div class="new-env">
							<input
								class="input"
								type="text"
								placeholder="Nombre del entorno (ej. Demo)"
								bind:value={newEnvName}
							/>
							<button class="btn btn-primary" onclick={addEnv}>Agregar</button>
						</div>
					{/if}

					{#each project.environments as env (env.id)}
						<section class="env-card">
							<div class="env-card-head">
								<h3 class="env-name">{env.name}</h3>
								{#if env.url}<span class="mono muted">{env.url}</span>{/if}
								{#if env.vars?.length}
									<button
										class="btn btn-ghost small"
										onclick={() => copyText(envBlock(env), `.env de ${env.name}`)}
									>
										Copiar todo el .env de {env.name}
									</button>
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
						</section>
					{:else}
						<p class="muted empty">Sin entornos todavía.</p>
					{/each}
				</div>
			{:else if activeTab === 'code'}
				<div class="two-pane">
					<div class="side">
						{#each project.codeFiles as f (f.id)}
							<button
								class="side-item mono"
								class:active={activeFile?.id === f.id}
								onclick={() => (activeFileId = f.id)}
							>
								{f.path}
							</button>
						{:else}
							<p class="muted empty">Sin archivos todavía.</p>
						{/each}
					</div>
					<div class="pane">
						{#if activeFile}
							<div class="pane-head">
								<h2 class="pane-title mono">{activeFile.path}</h2>
							</div>
							<pre class="code"><code>{activeFile.snippet}</code></pre>
						{/if}
					</div>
				</div>
			{:else if activeTab === 'notas'}
				<div class="notas-tab">
					<div class="pane-head">
						<h2 class="pane-title">Bitácora</h2>
						<button class="btn btn-ghost" onclick={() => copyText(notasMd, 'Bitácora')}>
							Copiar como Markdown
						</button>
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
					<section class="deploy-card">
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
					</section>

					<section class="deploy-card">
						<div class="deploy-card-head">
							<h2 class="pane-title">Checklist de deploy</h2>
							<span class="muted">{doneCount} de {project.checklist.length} listos</span>
						</div>
						{#each project.checklist as c (c.id)}
							<label class="check-item">
								<input type="checkbox" bind:checked={c.done} />
								<span class="check-text" class:done={c.done}>{c.text}</span>
							</label>
						{:else}
							<p class="muted empty">Sin checklist registrado.</p>
						{/each}
					</section>
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
		<a class="btn btn-ghost" href="/">← Volver a la constelación</a>
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
	.menu {
		position: absolute;
		right: 0;
		top: calc(100% + 6px);
		min-width: 210px;
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-md);
		padding: 6px;
		z-index: 50;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
	}
	.menu-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 9px 12px;
		border-radius: var(--radius-sm);
		font-size: 14px;
		color: var(--text-secondary);
	}
	.menu-item:hover {
		background: var(--bg-ghost);
		color: var(--text-primary);
	}

	.tabs {
		display: flex;
		gap: 4px;
		border-bottom: 1px solid var(--border-panel);
		margin-bottom: 24px;
		overflow-x: auto;
	}
	.tab {
		padding: 10px 14px;
		font-size: 14px;
		color: var(--text-faint);
		border-bottom: 2px solid transparent;
		white-space: nowrap;
	}
	.tab:hover {
		color: var(--text-primary);
	}
	.tab.active {
		color: var(--text-primary);
		border-bottom-color: var(--accent-personal);
	}

	.content {
		flex: 1;
	}

	.two-pane {
		display: flex;
		gap: 20px;
		align-items: flex-start;
	}
	.side {
		width: 240px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.side-item {
		text-align: left;
		padding: 9px 12px;
		border-radius: var(--radius-sm);
		font-size: 14px;
		color: var(--text-secondary);
	}
	.side-item:hover {
		background: var(--bg-ghost);
	}
	.side-item.active {
		background: var(--bg-ghost);
		color: var(--text-primary);
	}
	.pane {
		flex: 1;
		min-width: 0;
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
		padding: 20px;
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
	.new-env .input {
		flex: 1;
	}
	.env-card {
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
		padding: 18px 20px;
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
	.small {
		padding: 7px 12px;
		font-size: 13px;
		margin-left: auto;
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
		border-color: #433e61;
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
	.new-warning .input {
		flex: 1;
	}

	.deploy-tab {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		align-items: start;
	}
	.deploy-card {
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
		padding: 18px 20px;
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
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 9px 0;
		cursor: pointer;
	}
	.check-item input {
		accent-color: var(--accent-personal);
		width: 16px;
		height: 16px;
		margin-top: 1px;
		flex-shrink: 0;
	}
	.check-text {
		font-size: 14px;
		color: var(--text-secondary);
		transition: color 0.15s ease;
	}
	.check-text.done {
		text-decoration: line-through;
		color: var(--text-very-faint);
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
		.two-pane {
			flex-direction: column;
		}
		.side {
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.deploy-tab {
			grid-template-columns: 1fr;
		}
	}
</style>
