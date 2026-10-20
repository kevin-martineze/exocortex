export const toast = $state({ message: null });

let timer;

export function showToast(message) {
	toast.message = message;
	clearTimeout(timer);
	timer = setTimeout(() => (toast.message = null), 2200);
}
