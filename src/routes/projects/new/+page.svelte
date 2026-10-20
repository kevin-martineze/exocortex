<script>
	import { goto } from '$app/navigation';
	import ProjectForm from '#lib/components/project/ProjectForm.svelte';

	function create() {
		goto('/');
	}
</script>

<div class="page flat-bg new-page">
	<div class="new-card">
		<ProjectForm onsubmit={create} />
	</div>
</div>

<style>
	.new-page {
		align-items: center;
		padding: 48px 24px;
	}
	.new-card {
		width: 100%;
		max-width: 560px;
	}
</style>
