import type P5 from "p5";
import { createMutable } from "solid-js/store";
import type { IMAGE_FORMATS, VIDEO_FORMATS } from "./export";

/** Internal store for state that is not controlled by the user */
const internal = createMutable({
	p5: undefined as typeof P5.prototype | undefined,
	timeoutId: undefined as NodeJS.Timeout | undefined,
	exportProgress: 0,
	isExporting: false,
	hideMenu: false,
});

/** Controls store for state that is controlled by the user */
const controls = createMutable({
	// General
	width: 720,
	height: 540,
	scale: 1,
	fitScreen: false,
	frameRate: 60,
	startFrame: 10_000,
	currentFrame: 0,
	outputFrames: 120,
	loopFrames: false,
	paused: false,
	seed: 1,
	fileName: "canvas-starter",
	videoFormat: "mp4" as (typeof VIDEO_FORMATS)[number],
	imageFormat: "png" as (typeof IMAGE_FORMATS)[number],

	// Sketch
	circleRadius: 16,
	circleSpeed: 0.071,
	circleMovement: 100,
});

export { controls, internal };
