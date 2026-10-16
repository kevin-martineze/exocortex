<script>
	import { CLUSTERS, projectLoad } from '#lib/mockData';

	let { project, selected = false, variant = 0, onclick } = $props();

	let cluster = $derived(CLUSTERS[project.cluster]);
	let accent = $derived(cluster.color);
	let load = $derived(projectLoad(project));

	// Misma fórmula que el prototipo: hasta 60% de blanco mezclado al tope de carga,
	// un halo (box-shadow) que crece en blur/spread/alpha con la carga.
	let loadPct = $derived(Math.round((load / 10) * 60));
	let coreColor = $derived(`color-mix(in srgb, ${accent} ${100 - loadPct}%, #ffffff ${loadPct}%)`);
	let glowBlur = $derived(14 + load * 5);
	let glowSpread = $derived(1 + Math.round(load * 0.7));
	let glowAlphaHex = $derived(
		Math.round((0.3 + load * 0.045) * 255)
			.toString(16)
			.padStart(2, '0')
	);

	let radius = $derived(project.role === 'director' ? 42 : 36);
	let coreBg = $derived(
		`radial-gradient(circle at 32% 28%, ${coreColor}, ${accent}55 60%, ${accent}22 100%)`
	);

	let shadow = $derived.by(() => {
		let s = `0 0 ${glowBlur}px ${glowSpread}px ${accent}${glowAlphaHex}`;
		if (project.locked) {
			s = `0 0 0 3px #05060c, 0 0 0 5px #e06a6a, ${s}`;
		}
		if (selected) {
			s += `, 0 0 0 2px ${accent}`;
		}
		return s;
	});

	let floatClass = $derived(['float-a', 'float-b', 'float-c'][variant % 3]);
</script>

<button
	type="button"
	class="node"
	class:paused={project.status === 'pausado'}
	aria-label={`${project.title}, ${cluster.label}${project.role ? ', ' + project.role : ''}, carga ${load} de 10`}
	style:left={project.position.x + '%'}
	style:top={project.position.y + '%'}
	onclick={onclick}
>
	<span class="float {floatClass}">
		<span
			class="core"
			style:width={radius * 2 + 'px'}
			style:height={radius * 2 + 'px'}
			style:background={coreBg}
			style:box-shadow={shadow}
		></span>
		<span class="label" style:color={cluster.labelColor}>{project.title}</span>
	</span>
</button>

<style>
	.node {
		position: absolute;
		transform: translate(-50%, -50%);
		background: none;
		padding: 0;
		display: block;
		cursor: pointer;
	}
	.node.paused {
		opacity: 0.55;
	}
	.float {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.core {
		border-radius: 50%;
		transition: transform 0.18s ease;
	}
	.node:hover .core {
		transform: scale(1.08);
	}
	.label {
		font-size: 12.5px;
		font-weight: 500;
		max-width: 130px;
		text-align: center;
		line-height: 1.25;
		white-space: nowrap;
	}
</style>
