/** @typedef {{ scale: number, x: number, y: number }} View */

export const MIN_SCALE = 0.6;
export const MAX_SCALE = 3;
export const STEP = 1.25;
export const LEVEL_1 = 1.4;
export const LEVEL_2 = 2.2;

/** @param {number} s @returns {number} */
export function clampScale(s) {
	return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

// Mantiene visible al menos el 25% del plano en cada eje.
/** @param {View} view @param {number} width @param {number} height @returns {View} */
export function clampPan(view, width, height) {
	const minX = width * 0.25 - width * view.scale;
	const minY = height * 0.25 - height * view.scale;
	return {
		scale: view.scale,
		x: Math.min(width * 0.75, Math.max(minX, view.x)),
		y: Math.min(height * 0.75, Math.max(minY, view.y))
	};
}

// Zoom dejando fijo el punto (px, py) del viewport.
/** @param {View} view @param {number} nextScale @param {number} px @param {number} py @param {number} width @param {number} height @returns {View} */
export function zoomAt(view, nextScale, px, py, width, height) {
	const scale = clampScale(nextScale);
	const ratio = scale / view.scale;
	return clampPan({ scale, x: px - (px - view.x) * ratio, y: py - (py - view.y) * ratio }, width, height);
}

/** @param {number} scale @returns {number} */
export function detailLevel(scale) {
	return scale >= LEVEL_2 ? 2 : scale >= LEVEL_1 ? 1 : 0;
}
