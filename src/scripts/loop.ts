import { draw } from "./sketch";
import { controls, internal } from "./stores";

const loop = (): void => {
	const { seed, currentFrame, startFrame, outputFrames, paused, loopFrames } = controls;
	const { p5, isExporting } = internal;

	if (!p5) {
		return;
	}

	p5.randomSeed(seed);
	p5.clear();

	draw(p5);

	if (!paused) {
		// Increment the progress if not paused
		controls.currentFrame = currentFrame + 1;

		const aboveLastFrame = currentFrame >= startFrame + outputFrames - 1;
		const belowFirstFrame = currentFrame < startFrame;

		if (loopFrames && (aboveLastFrame || belowFirstFrame)) {
			controls.currentFrame = startFrame;
		}
	}

	if (!isExporting) {
		internal.timeoutId = setTimeout(loop, 1000 / controls.frameRate);
	}
};

export { loop };
