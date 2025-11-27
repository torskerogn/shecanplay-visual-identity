import P5Lib from "p5";
import type { VoidComponent } from "solid-js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { loop } from "../scripts/loop";
import { setup } from "../scripts/sketch";
import { controls, internal } from "../scripts/stores";

const P5: VoidComponent = () => {
	const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();

	onMount(() => {
		// Create a new instance of P5Lib
		const p5 = new P5Lib(
			(p5) => {
				p5.setup = async (): Promise<void> => {
					// Run the external setup function
					await setup(p5);

					// Start the loop
					loop();
				};

				p5.draw = (): void => {
					// Leave the draw function empty
				};
			},
			containerRef(),
			false,
		);

		// Store the instance in the internal store
		internal.p5 = p5;

		addEventListener("resize", handleResize);

		onCleanup(() => {
			p5.remove();

			clearTimeout(internal.timeoutId);

			removeEventListener("resize", handleResize);
		});
	});

	// Reactive effect to handle canvas resize when the controls change
	createEffect(() => {
		handleResize();
	});

	const handleResize = (): void => {
		const { p5 } = internal;
		const { width, height, fitScreen } = controls;

		if (!p5) {
			return;
		}

		p5.resizeCanvas(width, height);

		// If the fit screen option is enabled, adjust the scale to fit the canvas to the screen (object-fit: contain)
		if (fitScreen) {
			if (width / height > innerWidth / innerHeight) {
				controls.scale = innerWidth / width;
			} else {
				controls.scale = innerHeight / height;
			}
		}
	};

	return (
		<div
			ref={setContainerRef}
			style={{ "--scale": controls.scale }}
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-(--scale) bg-white"
		></div>
	);
};

export { P5 };
