<script>
	import CopyButton from '../../ui/CopyButton.svelte';
	import EmptyState from '../../ui/EmptyState.svelte';

	/** @typedef {import('#lib/domain/types.js').Command} Command */
	/** @typedef {import('#lib/domain/types.js').QuickLink} QuickLink */

	/** @type {{ commands: Command[], quickLinks: QuickLink[] }} */
	let { commands, quickLinks } = $props();
</script>

<div class="comandos-tab">
	<section>
		<h2 class="card-title">Comandos frecuentes</h2>
		{#each commands as c (c.id)}
			<div class="cmd-row">
				<span class="cmd-label">{c.label}</span>
				<code class="cmd mono">{c.command}</code>
				<CopyButton value={c.command} toast="Comando" ariaLabel={`Copiar ${c.label}`} />
			</div>
		{:else}
			<EmptyState>Sin comandos todavía.</EmptyState>
		{/each}
	</section>

	<section>
		<h2 class="card-title">Enlaces rápidos</h2>
		<div class="quick-links">
			{#each quickLinks as l (l.id)}
				<a class="quick-link" href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
			{:else}
				<EmptyState>Sin enlaces todavía.</EmptyState>
			{/each}
		</div>
	</section>
</div>

<style>
	.comandos-tab {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.card-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
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
</style>
