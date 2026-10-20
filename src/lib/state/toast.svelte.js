/** @type {{ message: string | null }} */
export const toast = $state({ message: null });

/** @type {ReturnType<typeof setTimeout> | undefined} */
let timer;

/** @param {string} message */
export function showToast(message) {
	toast.message = message;
	clearTimeout(timer);
	timer = setTimeout(() => (toast.message = null), 2200);
}
