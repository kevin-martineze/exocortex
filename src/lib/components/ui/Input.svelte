<script>
	/** @type {{ value?: string, type?: string, mono?: boolean } & import('svelte/elements').HTMLInputAttributes} */
	let { value = $bindable(''), type = 'text', mono = false, ...rest } = $props();
</script>

<input class="input" class:mono {type} bind:value {...rest} />

<style>
	.input {
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		border-radius: var(--radius-md);
		padding: 11px 13px;
		color: var(--text-primary);
		font-size: 14px;
		width: 100%;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	.input::placeholder {
		color: var(--text-very-faint);
	}
	.input:focus {
		outline: none;
		border-color: var(--accent-personal);
		box-shadow: 0 0 0 2px var(--accent-personal);
	}
</style>
