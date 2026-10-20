<script>
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';

	/** @typedef {import('#lib/domain/types.js').Warning} Warning */

	/** @type {{ warnings: Warning[], onadd: (text: string) => void }} */
	let { warnings, onadd } = $props();

	let open = $state(false);
	let text = $state('');

	function add() {
		const t = text.trim();
		if (!t) return;
		onadd(t);
		text = '';
		open = false;
	}
</script>

<section class="warnings" aria-label="Advertencias fijadas">
	<div class="warnings-head">
		<span class="warnings-title">Advertencias fijadas</span>
		<Button size="sm" onclick={() => (open = !open)}>+ Fijar advertencia</Button>
	</div>
	{#if warnings.length}
		<ul class="warnings-list">
			{#each warnings as w (w.id)}
				<li class="warning">⚠️ {w.text}</li>
			{/each}
		</ul>
	{:else}
		<p class="warnings-empty">Sin advertencias fijadas.</p>
	{/if}
	{#if open}
		<div class="new-warning">
			<Input style="flex: 1" placeholder="Advertencia (ej. no tocar X sin leer Y)" bind:value={text} />
			<Button variant="primary" onclick={add}>Agregar</Button>
		</div>
	{/if}
</section>

<style>
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
		margin: 0;
		font-size: 13px;
		color: var(--text-very-faint);
	}
	.new-warning {
		display: flex;
		gap: 10px;
		margin-top: 12px;
	}
</style>
