<script>
	import { copyText } from '#lib/utils/clipboard';
	import Button from '../../ui/Button.svelte';
	import SectionHeader from '../../ui/SectionHeader.svelte';
	import SplitPane from '../../ui/SplitPane.svelte';
	import NavList from '../../ui/NavList.svelte';

	/** @typedef {import('#lib/domain/types.js').Doc} Doc */

	/** @type {{ docs: Doc[] }} */
	let { docs } = $props();

	/** @type {string | null} */
	let activeId = $state(null);
	let items = $derived(docs.map((d) => ({ id: d.id, label: d.title })));
	let active = $derived(docs.find((d) => d.id === activeId) ?? docs[0] ?? null);

	$effect(() => {
		if (activeId == null && docs[0]) activeId = docs[0].id;
	});
</script>

<SplitPane>
	{#snippet side()}
		<NavList {items} bind:active={activeId} empty="Sin documentos todavía." />
	{/snippet}
	{#if active}
		<SectionHeader title={active.title}>
			<Button onclick={() => copyText(active.content, 'Documento')}>Copiar como Markdown</Button>
		</SectionHeader>
		<pre class="markdown">{active.content}</pre>
	{/if}
</SplitPane>

<style>
	.markdown {
		white-space: pre-line;
		font-family: var(--font-sans);
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0;
	}
</style>
