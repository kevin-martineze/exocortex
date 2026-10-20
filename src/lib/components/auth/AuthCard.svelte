<script>
	import Card from '../ui/Card.svelte';

	/** @type {{ title: string, subtitle?: string, children?: import('svelte').Snippet }} */
	let { title, subtitle, children } = $props();
</script>

<div class="auth-page cosmic-bg">
	<div class="auth-wrap">
		<Card padding="lg">
			<h1 class="auth-title">{title}</h1>
			{#if subtitle}<p class="auth-sub">{subtitle}</p>{/if}
			{@render children?.()}
		</Card>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}
	.auth-wrap {
		width: 100%;
		max-width: 430px;
	}
	.auth-title {
		margin: 0 0 8px;
		font-size: 22px;
		font-weight: 700;
	}
	.auth-sub {
		margin: 0 0 24px;
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-secondary);
	}
</style>
