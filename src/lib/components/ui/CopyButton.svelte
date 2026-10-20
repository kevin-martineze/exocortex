<script>
	import { copyText } from '#lib/utils/clipboard';
	import IconButton from './IconButton.svelte';
	import Icon from './Icon.svelte';

	let { value, toast = 'Contenido', ariaLabel } = $props();
</script>

<IconButton label={ariaLabel ?? `Copiar ${toast}`} onclick={() => copyText(value, toast)}>
	<Icon name="copy" />
</IconButton>
