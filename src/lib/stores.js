import { writable } from 'svelte/store';

export const toast = writable(null);

let timer;

export function showToast(message) {
	toast.set(message);
	clearTimeout(timer);
	timer = setTimeout(() => toast.set(null), 2200);
}
