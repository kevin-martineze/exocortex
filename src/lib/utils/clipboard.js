import { showToast } from '#lib/state/toast.svelte.js';

/** @param {string} text @returns {boolean} */
function fallbackCopy(text) {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	try {
		document.execCommand('copy');
		return true;
	} catch {
		return false;
	} finally {
		document.body.removeChild(textarea);
	}
}

/** @param {string} text @param {string} [label] @returns {Promise<boolean>} */
export async function copyText(text, label = 'Contenido') {
	let ok = false;
	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			ok = true;
		} catch {
			ok = fallbackCopy(text);
		}
	} else {
		ok = fallbackCopy(text);
	}
	showToast(ok ? `${label} copiado ✓` : 'No se pudo copiar');
	return ok;
}
