<script>
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import Toast from '#lib/components/ui/Toast.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#05060c" />
</svelte:head>

{@render children()}
<Toast />
