<script>
	import { CLUSTERS, projectLoad } from '#lib/mockData';

	let { project, selected = false, variant = 0, onclick } = $props();

	const color = CLUSTERS[project.cluster].color;
	const load = projectLoad(project);
	const mixPct = load * 10;
	const coreBg = `color-mix(in srgb, ${color} ${100 - mixPct}%, #ffffff ${mixPct}%)`;
	const glowSize = 6 + load * 2;
	const glowAlpha = 22 + load * 6;

	let shadow = `0 0 ${glowSize}px color-mix(in srgb, ${color} ${glowAlpha}%, transparent)`;
	if (project.locked) {
		shadow += ', 0 0 0 2px #e06a6a, 0 0 0 9px rgba(224, 106, 106, 0.16)';
	}
	if (selected) {
		shadow += `, 0 0 0 2px ${color}`;
	}

	const floatClass = ['float-a', 'float-b', 'float-c'][variant % 3];
</script>

<button
	type="button"
	class="node"
	class:paused={project.status === 'pausado'}
	aria-label={project.title}
	style:left={project.position.x + '%'}
	style:top={project.position.y + '%'}
	onclick={onclick}
>
	<span class="float {floatClass}">
		<span class="core" style:background={coreBg} style:box-shadow={shadow}></span>
		<span class="label">{project.title}</span>
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
		gap: 8px;
	}
	.core {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.14);
		transition: transform 0.18s ease;
	}
	.node:hover .core {
		transform: scale(1.12);
	}
	.label {
		font-size: 12.5px;
		font-weight: 500;
		color: var(--text-secondary);
		max-width: 120px;
		text-align: center;
		line-height: 1.25;
	}
</style>
