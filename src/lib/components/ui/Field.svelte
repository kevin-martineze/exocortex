<script>
	/** @type {{ label: string, id?: string, hint?: string, children: import('svelte').Snippet }} */
	let { label, id, hint, children } = $props();
</script>

<div class="field">
	{#if id}
		<label class="label" for={id}>{label}</label>
	{:else}
		<span class="label">{label}</span>
	{/if}
	{@render children?.()}
	{#if hint}<p class="hint">{hint}</p>{/if}
</div>

<style>
	.field {
		margin-bottom: 18px;
	}
	.label {
		display: block;
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 7px;
	}
	.hint {
		font-size: 12px;
		color: var(--text-faint);
		margin: 6px 0 0;
	}
</style>
