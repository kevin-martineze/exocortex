<script>
	/** @type {{ title: string, mono?: boolean, children?: import('svelte').Snippet }} */
	let { title, mono = false, children } = $props();
</script>

<div class="section-head">
	<h2 class="section-title" class:mono>{title}</h2>
	{@render children?.()}
</div>

<style>
	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
		flex-wrap: wrap;
	}
	.section-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}
</style>
