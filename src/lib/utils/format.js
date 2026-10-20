/** @param {string} iso @returns {string} */
export function formatShortDate(iso) {
	return new Date(iso + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
