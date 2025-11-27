const getCanvas = (): HTMLCanvasElement => {
	const canvas = document.querySelector("canvas.p5Canvas");
	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("Canvas not found");
	}

	return canvas;
};

const truncate = (value: number, precision: number): number => Number(value.toFixed(precision));

const step = (value: number, step: number): number => Math.round(value / step) * step;

const pipe = <T>(value: T, ...functions: ((value: T) => T)[]): T => {
	let result = value;

	for (const fn of functions) {
		result = fn(result);
	}

	return result;
};

export { getCanvas, pipe, step, truncate };
