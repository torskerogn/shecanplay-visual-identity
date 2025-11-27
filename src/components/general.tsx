import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import {
	canvasToImageBlob,
	downloadFile,
	framesCanvasToVideoBlob,
	IMAGE_FORMATS,
	VIDEO_FORMATS,
} from "../scripts/export";
import { getCanvas } from "../scripts/lib";
import { loop } from "../scripts/loop";
import { controls, internal } from "../scripts/stores";
import { Folder } from "./folder";
import { CheckboxInput } from "./inputs/checkbox-input";
import { NumberInput } from "./inputs/number-input";
import { RadioInput } from "./inputs/radio-input";
import { RangeInput } from "./inputs/range-input";
import { TextInput } from "./inputs/text-input";

/** Component for the general controls */
const General: VoidComponent = () => (
	<Folder title="General" open={false}>
		<RangeInput
			label="width"
			min={1}
			max={3840}
			step={1}
			value={controls.width}
			onChange={(value) => {
				controls.width = value;
			}}
		/>

		<RangeInput
			label="height"
			min={0}
			max={2160}
			step={1}
			value={controls.height}
			onChange={(value) => {
				controls.height = value;
			}}
		/>

		<RangeInput
			label="scale"
			min={0}
			max={2}
			step={0.025}
			value={controls.scale}
			onChange={(value) => {
				controls.scale = value;
			}}
		/>

		<CheckboxInput
			name="fit-screen"
			label="fit screen"
			value={controls.fitScreen}
			onChange={(value) => {
				controls.fitScreen = value;

				if (!value) {
					controls.scale = 1;
				}
			}}
		/>

		<RangeInput
			label="frame rate"
			min={1}
			max={120}
			step={1}
			value={controls.frameRate}
			onChange={(value) => {
				controls.frameRate = value;
			}}
		/>

		<NumberInput
			label="start frame"
			min={0}
			max={1000}
			step={1}
			value={controls.startFrame}
			onChange={(value) => {
				controls.startFrame = value;
			}}
		/>

		<NumberInput
			label="current frame"
			min={0}
			step={1}
			value={controls.currentFrame}
			onChange={(value) => {
				controls.currentFrame = value;
			}}
		/>

		<NumberInput
			label="output frames"
			min={1}
			max={1000}
			step={1}
			value={controls.outputFrames}
			onChange={(value) => {
				controls.outputFrames = value;
			}}
		/>

		<CheckboxInput
			name="loop-frames"
			label="loop frames"
			value={controls.loopFrames}
			onChange={(value) => {
				controls.loopFrames = value;
			}}
		/>

		<CheckboxInput
			name="paused"
			label="paused"
			value={controls.paused}
			onChange={(value) => {
				controls.paused = value;
			}}
		/>

		<RangeInput
			label="seed"
			min={0}
			max={1000}
			step={1}
			value={controls.seed}
			onChange={(value) => {
				controls.seed = value;
			}}
		/>

		<TextInput
			name="file-name"
			label="file name"
			value={controls.fileName}
			onChange={(value) => {
				controls.fileName = value;
			}}
		/>

		<RadioInput
			name="video-format"
			title="video output format"
			options={VIDEO_FORMATS.map((videoFormat) => ({
				name: "video-format",
				value: videoFormat,
				checked: controls.videoFormat === videoFormat,
				onChange(): void {
					controls.videoFormat = videoFormat;
				},
			}))}
		/>

		<RadioInput
			name="image-format"
			title="image output format"
			options={IMAGE_FORMATS.map((imageFormat) => ({
				name: "image-format",
				value: imageFormat,
				checked: controls.imageFormat === imageFormat,
				onChange(): void {
					controls.imageFormat = imageFormat;
				},
			}))}
		/>

		<button
			type="button"
			class="shadow-menu clickable relative"
			disabled={internal.exportProgress > 0}
			onClick={async () => {
				const blob = await canvasToImageBlob(getCanvas(), { imageFormat: controls.imageFormat });

				if (blob) {
					downloadFile(blob, controls.fileName);
				}
			}}
		>
			<span>Export image</span>
		</button>

		<button
			type="button"
			class="shadow-menu clickable relative"
			disabled={internal.exportProgress > 0}
			onClick={async () => {
				const wasPaused = controls.paused;

				internal.isExporting = true;
				internal.exportProgress = 0;
				controls.currentFrame = controls.startFrame;
				controls.paused = false;

				const blob = await framesCanvasToVideoBlob({
					canvas: getCanvas(),
					frames: controls.outputFrames,
					fps: controls.frameRate,
					onProgress: (value) => {
						internal.exportProgress = value * 100;
					},
					onDraw: () => {
						loop();
					},
					videoFormat: "mp4",
				});

				internal.isExporting = false;
				internal.exportProgress = 0;
				controls.currentFrame = controls.startFrame;
				controls.paused = wasPaused;

				loop();

				if (blob) {
					downloadFile(blob, controls.fileName);
				}
			}}
		>
			<span>
				Export video
				<Show when={internal.exportProgress > 0}>: {Math.round(internal.exportProgress)}%</Show>
			</span>
		</button>
	</Folder>
);

export { General };
