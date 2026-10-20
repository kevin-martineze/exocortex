<script>
	let {
		variant = 'ghost',
		size = 'md',
		block = false,
		type = 'button',
		href,
		disabled = false,
		onclick,
		children,
		...rest
	} = $props();

	let cls = $derived(
		`btn ${variant}${size === 'sm' ? ' sm' : ''}${block ? ' block' : ''}`
	);
</script>

{#if href}
	<a class={cls} {href} {onclick} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button class={cls} {type} {disabled} {onclick} {...rest}>
		{@render children?.()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 14px;
		padding: 11px 18px;
		transition: filter 0.15s ease, border-color 0.15s ease, background 0.15s ease;
		white-space: nowrap;
	}
	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.primary {
		background: var(--accent-personal);
		color: var(--text-on-accent);
		font-weight: 700;
	}
	.primary:hover:not(:disabled) {
		filter: brightness(1.08);
	}
	.ghost {
		background: var(--bg-ghost);
		border: 1px solid var(--border-input);
		color: var(--text-ghost);
	}
	.ghost:hover:not(:disabled) {
		border-color: var(--border-hover);
	}
	.sm {
		padding: 7px 12px;
		font-size: 13px;
	}
	.block {
		width: 100%;
	}
</style>
