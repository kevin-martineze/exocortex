<script>
	import { getProjects } from '#lib/data/mock-projects';
	import { CLUSTERS, STATUS } from '#lib/domain/constants';
	import Modal from '../ui/Modal.svelte';
	import Badge from '../ui/Badge.svelte';
	import Icon from '../ui/Icon.svelte';

	/** @type {{ open?: boolean, onclose?: () => void }} */
	let { open = false, onclose } = $props();

	let query = $state('');
	/** @type {HTMLInputElement | undefined} */
	let input;
	let results = $derived(
		getProjects().filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()))
	);

	$effect(() => {
		if (open) input?.focus();
	});
</script>

<Modal open={open} onclose={onclose}>
	<div class="palette">
		<div class="search">
			<span class="search-icon"><Icon name="search" size={16} /></span>
			<input
				class="search-input"
				type="text"
				placeholder="Buscar proyectos…"
				bind:this={input}
				bind:value={query}
			/>
		</div>
		<ul class="results">
			{#each results as p (p.id)}
				<li>
					<a class="result" href={`/projects/${p.id}`} onclick={onclose}>
						<span class="result-title">{p.title}</span>
						<span class="result-meta">
							<Badge label={CLUSTERS[p.cluster].label} color={CLUSTERS[p.cluster].color} dot={false} />
							<span class="status-dot" style:background={STATUS[p.status].color}></span>
						</span>
					</a>
				</li>
			{:else}
				<li class="empty">Sin resultados para “{query}”</li>
			{/each}
		</ul>
	</div>
</Modal>

<style>
	.palette {
		display: flex;
		flex-direction: column;
	}
	.search {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		border-bottom: 1px solid var(--border-panel);
	}
	.search-icon {
		color: var(--text-faint);
		flex-shrink: 0;
	}
	.search-input {
		border: none;
		background: transparent;
		padding: 0;
		font-size: 15px;
		color: var(--text-primary);
		flex: 1;
		min-width: 0;
	}
	.search-input:focus {
		box-shadow: none;
	}
	.results {
		list-style: none;
		margin: 0;
		padding: 8px;
		max-height: 320px;
		overflow-y: auto;
	}
	.result {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 12px;
		border-radius: var(--radius-sm);
	}
	.result:hover {
		background: var(--bg-ghost);
	}
	.result-title {
		font-size: 14px;
		font-weight: 500;
	}
	.result-meta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}
	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	.empty {
		padding: 20px 12px;
		font-size: 14px;
		color: var(--text-very-faint);
		text-align: center;
	}
</style>
