<script>
	import SearchButton from '../search/SearchButton.svelte';

	/** @type {{ onsearch: () => void }} */
	let { onsearch } = $props();
</script>

<header class="topbar">
	<span class="wordmark">Exocortex</span>
	<SearchButton onclick={onsearch} />
</header>

<style>
	.topbar {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 24px;
	}
	.wordmark {
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.02em;
	}
</style>
