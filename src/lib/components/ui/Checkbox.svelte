<script>
	/** @type {{ checked?: boolean, strike?: boolean, onchange?: (checked: boolean) => void, children?: import('svelte').Snippet }} */
	let { checked = $bindable(false), strike = false, onchange, children } = $props();

	/** @param {Event} e */
	function handleChange(e) {
		onchange?.(e.currentTarget instanceof HTMLInputElement ? e.currentTarget.checked : false);
	}
</script>

<label class="checkbox">
	<input type="checkbox" bind:checked onchange={handleChange} />
	<span class:done={strike && checked}>{@render children?.()}</span>
</label>

<style>
	.checkbox {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 14px;
		color: var(--text-secondary);
		cursor: pointer;
	}
	.checkbox input {
		accent-color: var(--accent-personal);
		width: 16px;
		height: 16px;
		margin-top: 1px;
		flex-shrink: 0;
	}
	.done {
		text-decoration: line-through;
		color: var(--text-very-faint);
	}
</style>
