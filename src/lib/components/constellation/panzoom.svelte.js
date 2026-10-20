import { clampPan, zoomAt, detailLevel, STEP } from '#lib/utils/zoom';

/** @param {{ x: number, y: number }} a @param {{ x: number, y: number }} b @returns {number} */
function dist(a, b) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

// Toda la lógica de zoom/paneo de la constelación, separada de la vista.
export class PanZoom {
	view = $state({ scale: 1, x: 0, y: 0 });
	animate = $state(false);
	dragging = $state(false);
	level = $derived(detailLevel(this.view.scale));

	/** @type {HTMLElement | undefined} */
	#viewport;
	/** @type {Map<number, { x: number, y: number }>} */
	#pointers = new Map();
	#panStart = { x: 0, y: 0 };
	#panStartView = { scale: 1, x: 0, y: 0 };
	#pinchStart = { dist: 0, scale: 1 };

	/** @param {HTMLElement} el @returns {() => void} */
	attach = (el) => {
		this.#viewport = el;
		el.addEventListener('wheel', this.#onWheel, { passive: false });
		return () => el.removeEventListener('wheel', this.#onWheel);
	};

	/** @param {WheelEvent} e */
	#onWheel = (e) => {
		e.preventDefault();
		const el = this.#viewport;
		if (!el) return;
		this.animate = false;
		const r = el.getBoundingClientRect();
		const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
		this.view = zoomAt(
			this.view,
			this.view.scale * Math.exp(-d * 0.0015),
			e.clientX - r.left,
			e.clientY - r.top,
			r.width,
			r.height
		);
	};

	/** @param {PointerEvent} e */
	onpointerdown = (e) => {
		if (e.target instanceof Element && e.target.closest('.node')) return;
		const el = this.#viewport;
		if (!el) return;
		this.animate = false;
		this.#pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		el.setPointerCapture(e.pointerId);
		if (this.#pointers.size === 1) {
			this.#panStart = { x: e.clientX, y: e.clientY };
			this.#panStartView = this.view;
		} else if (this.#pointers.size === 2) {
			const [a, b] = [...this.#pointers.values()];
			this.#pinchStart = { dist: dist(a, b), scale: this.view.scale };
		}
	};

	/** @param {PointerEvent} e */
	onpointermove = (e) => {
		if (!this.#pointers.has(e.pointerId)) return;
		const el = this.#viewport;
		if (!el) return;
		this.#pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		const r = el.getBoundingClientRect();
		if (this.#pointers.size === 1) {
			const dx = e.clientX - this.#panStart.x;
			const dy = e.clientY - this.#panStart.y;
			if (Math.hypot(dx, dy) > 4) this.dragging = true;
			this.view = clampPan(
				{ scale: this.view.scale, x: this.#panStartView.x + dx, y: this.#panStartView.y + dy },
				r.width,
				r.height
			);
		} else if (this.#pointers.size === 2) {
			const [a, b] = [...this.#pointers.values()];
			const d = dist(a, b);
			const midX = (a.x + b.x) / 2;
			const midY = (a.y + b.y) / 2;
			this.view = zoomAt(
				this.view,
				this.#pinchStart.scale * (d / this.#pinchStart.dist),
				midX - r.left,
				midY - r.top,
				r.width,
				r.height
			);
		}
	};

	/** @param {PointerEvent} e */
	onpointerup = (e) => {
		this.#pointers.delete(e.pointerId);
		if (this.#pointers.size === 0) {
			this.dragging = false;
		} else if (this.#pointers.size === 1) {
			const [remaining] = [...this.#pointers.values()];
			this.#panStart = { x: remaining.x, y: remaining.y };
			this.#panStartView = this.view;
		}
	};

	zoomIn = () => this.#zoomBy(STEP);
	zoomOut = () => this.#zoomBy(1 / STEP);
	reset = () => {
		this.animate = true;
		this.view = { scale: 1, x: 0, y: 0 };
	};

	/** @param {number} f */
	#zoomBy(f) {
		const el = this.#viewport;
		if (!el) return;
		const r = el.getBoundingClientRect();
		this.animate = true;
		this.view = zoomAt(this.view, this.view.scale * f, r.width / 2, r.height / 2, r.width, r.height);
	}

	/** @param {KeyboardEvent} e @returns {boolean} */
	handleKey = (e) => {
		if (e.metaKey || e.ctrlKey || e.altKey) return false;
		if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"]')) {
			return false;
		}
		if (e.key === '+' || e.key === '=') {
			e.preventDefault();
			this.zoomIn();
			return true;
		} else if (e.key === '-') {
			e.preventDefault();
			this.zoomOut();
			return true;
		} else if (e.key === '0') {
			e.preventDefault();
			this.reset();
			return true;
		}
		return false;
	};
}
