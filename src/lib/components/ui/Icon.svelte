<script>
	let { name, size = 15 } = $props();

	const PATHS = {
		search: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
		close: '<path d="M18 6 6 18M6 6l12 12"></path>',
		copy: '<rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
		fit: '<path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5"/>'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{@html PATHS[name]}
</svg>
