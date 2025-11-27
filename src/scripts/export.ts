import type { MetadataTags, OutputFormat, VideoSample } from "mediabunny";
import {
	ALL_FORMATS,
	BufferTarget,
	CanvasSource,
	getFirstEncodableVideoCodec,
	Input,
	MovOutputFormat,
	Mp4OutputFormat,
	Output,
	QUALITY_VERY_HIGH,
	UrlSource,
	VideoSampleSink,
	WebMOutputFormat,
} from "mediabunny";

const IMAGE_FORMATS = ["png", "jpeg", "webp"] as const;
const VIDEO_FORMATS = ["mp4", "mov", "webm"] as const;

const downloadFile = (blob: Blob, filename: string): void => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.append(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

const canvasToImageBlob = async (
	canvas: HTMLCanvasElement,
	options?: { imageFormat: (typeof IMAGE_FORMATS)[number] },
): Promise<Blob | undefined> => {
	const { imageFormat = IMAGE_FORMATS[0] } = options ?? {};

	try {
		if (!canvas) {
			console.error("Canvas not available for export");
			return undefined;
		}

		return await new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error("Failed to create blob from canvas"));
						return;
					}

					resolve(blob);
				},
				`image/${imageFormat}`,
				0.8,
			);
		});
	} catch (error) {
		console.error("Export failed:", error);
	}
};

const videoCanvasToVideoBlob = async ({
	canvas,
	video,
	onProgress,
	onDraw,
	videoFormat = VIDEO_FORMATS[0],
	metadataTags,
}: {
	canvas: HTMLCanvasElement;
	video: HTMLVideoElement;
	onProgress?: (progress: number) => void;
	onDraw?: (sample: VideoSample) => void;
	videoFormat?: (typeof VIDEO_FORMATS)[number];
	metadataTags?: MetadataTags;
}): Promise<Blob | undefined> => {
	try {
		// Reset the progress
		onProgress?.(0);

		// Create a map of video formats to output formats
		const formatMap = {
			mov: new MovOutputFormat(),
			webm: new WebMOutputFormat(),
			mp4: new Mp4OutputFormat(),
		} as const satisfies Record<(typeof VIDEO_FORMATS)[number], OutputFormat>;

		// Create output
		const output = new Output({ format: formatMap[videoFormat], target: new BufferTarget() });

		// Set metadata tags on the output
		output.setMetadataTags({
			artist: "Canvas Starter",
			date: new Date(),
			title: "Canvas Video",
			...metadataTags,
		});

		// Get video codec
		const videoCodec = await getFirstEncodableVideoCodec(output.format.getSupportedVideoCodecs(), {
			width: canvas.width,
			height: canvas.height,
			bitrate: QUALITY_VERY_HIGH,
		});
		if (!videoCodec) {
			throw new Error("Your browser doesn't support video encoding.");
		}

		// Create canvas source
		const canvasSource = new CanvasSource(canvas, {
			codec: videoCodec,
			bitrate: QUALITY_VERY_HIGH,
		});

		// Add the canvas source to the output as a video track
		output.addVideoTrack(canvasSource);

		// Start the output
		await output.start();

		// Create an input for the input source
		const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(video.src) });

		// Get the video track from the input
		const videoTrack = await input.getPrimaryVideoTrack();
		if (!videoTrack) {
			throw new Error("No video track found");
		}

		// Create a video sample sink to iterate over the frames of the input source
		const sink = new VideoSampleSink(videoTrack);

		// Iterate over the video frames
		for await (const sample of sink.samples()) {
			// Draw the frame to the canvas
			onDraw?.(sample);

			// Add the frame to the canvas source
			await canvasSource.add(sample.timestamp, sample.duration);

			// Update the progress
			onProgress?.(sample.timestamp / video.duration);
		}

		// Close the canvas source and finalize the output
		canvasSource.close();
		await output.finalize();

		// Check if the output has a buffer
		if (!output.target.buffer) {
			throw new Error("Failed to export video");
		}

		// Return the blob of the output buffer
		return new Blob([output.target.buffer], { type: output.format.mimeType });
	} catch (error) {
		console.error("Export failed:", error);
	} finally {
		// Reset the progress
		onProgress?.(0);
	}
};

const framesCanvasToVideoBlob = async ({
	canvas,
	frames,
	fps,
	onProgress,
	onDraw,
	videoFormat = VIDEO_FORMATS[0],
	metadataTags,
}: {
	canvas: HTMLCanvasElement;
	frames: number;
	fps: number;
	onProgress?: (progress: number) => void;
	onDraw?: (frame: number) => void;
	videoFormat?: (typeof VIDEO_FORMATS)[number];
	metadataTags?: MetadataTags;
}): Promise<Blob | undefined> => {
	try {
		// Reset the progress
		onProgress?.(0);

		// Create a map of video formats to output formats
		const formatMap = {
			mov: new MovOutputFormat(),
			webm: new WebMOutputFormat(),
			mp4: new Mp4OutputFormat(),
		} as const satisfies Record<(typeof VIDEO_FORMATS)[number], OutputFormat>;

		// Create output
		const output = new Output({ format: formatMap[videoFormat], target: new BufferTarget() });

		// Set metadata tags on the output
		output.setMetadataTags({
			artist: "Canvas Starter",
			date: new Date(),
			title: "Canvas Video",
			...metadataTags,
		});

		// Get video codec
		const videoCodec = await getFirstEncodableVideoCodec(output.format.getSupportedVideoCodecs(), {
			width: canvas.width,
			height: canvas.height,
			bitrate: QUALITY_VERY_HIGH,
		});
		if (!videoCodec) {
			throw new Error("Your browser doesn't support video encoding.");
		}

		// Create canvas source
		const canvasSource = new CanvasSource(canvas, {
			codec: videoCodec,
			bitrate: QUALITY_VERY_HIGH,
		});

		// Add the canvas source to the output as a video track
		output.addVideoTrack(canvasSource);

		// Start the output
		await output.start();

		// Iterate over the video frames
		for (let progress = 0; progress < frames; progress += 1) {
			// Draw the frame to the canvas
			onDraw?.(progress);

			// Add the frame to the canvas source
			await canvasSource.add(progress / fps, 1 / fps); // oxlint-disable-line no-await-in-loop

			// Update the progress
			onProgress?.(progress / frames);
		}

		// Close the canvas source and finalize the output
		canvasSource.close();
		await output.finalize();

		// Check if the output has a buffer
		if (!output.target.buffer) {
			throw new Error("Failed to export video");
		}

		// Return the blob of the output buffer
		return new Blob([output.target.buffer], { type: output.format.mimeType });
	} catch (error) {
		console.error("Export failed:", error);
	} finally {
		// Reset the progress
		onProgress?.(0);
	}
};

export {
	canvasToImageBlob,
	downloadFile,
	framesCanvasToVideoBlob,
	IMAGE_FORMATS,
	VIDEO_FORMATS,
	videoCanvasToVideoBlob,
};
