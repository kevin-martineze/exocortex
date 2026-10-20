<script>
	import { bitacoraMarkdown } from '#lib/domain/project';
	import { copyText } from '#lib/utils/clipboard';
	import Button from '../../ui/Button.svelte';
	import SectionHeader from '../../ui/SectionHeader.svelte';
	import EmptyState from '../../ui/EmptyState.svelte';

	/** @typedef {import('#lib/domain/types.js').BitacoraEntry} BitacoraEntry */

	/** @type {{ entries: BitacoraEntry[] }} */
	let { entries } = $props();
</script>

<div class="notas-tab">
	<SectionHeader title="Bitácora">
		<Button onclick={() => copyText(bitacoraMarkdown(entries), 'Bitácora')}>Copiar como Markdown</Button>
	</SectionHeader>
	{#each entries as b (b.id)}
		<article class="nota">
			<span class="mono nota-date">{b.date}</span>
			<p class="nota-text">{b.text}</p>
		</article>
	{:else}
		<EmptyState>Sin notas todavía.</EmptyState>
	{/each}
</div>

<style>
	.notas-tab {
		display: flex;
		flex-direction: column;
		gap: 20px;
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
</style>
