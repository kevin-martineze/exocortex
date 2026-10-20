<script>
	import SectionHeader from '../../ui/SectionHeader.svelte';
	import SplitPane from '../../ui/SplitPane.svelte';
	import NavList from '../../ui/NavList.svelte';

	/** @typedef {import('#lib/domain/types.js').CodeFile} CodeFile */

	/** @type {{ files: CodeFile[] }} */
	let { files } = $props();

	/** @type {string | null} */
	let activeId = $state(null);
	let items = $derived(files.map((f) => ({ id: f.id, label: f.path })));
	let active = $derived(files.find((f) => f.id === activeId) ?? files[0] ?? null);

	$effect(() => {
		if (activeId == null && files[0]) activeId = files[0].id;
	});
</script>

<SplitPane>
	{#snippet side()}
		<NavList {items} mono bind:active={activeId} empty="Sin archivos todavía." />
	{/snippet}
	{#if active}
		<SectionHeader title={active.path} mono />
		<pre class="code"><code>{active.snippet}</code></pre>
	{/if}
</SplitPane>

<style>
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
</style>
