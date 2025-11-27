import type { VoidComponent } from "solid-js";
import { createEffect, onCleanup, onMount } from "solid-js";
import { controls, internal } from "../scripts/stores";
import { General } from "./general";
import { Sketch } from "./sketch";

const LOCAL_STORAGE_KEY = `store-state-7`;

/** Component for the floating controls */
const Controls: VoidComponent = () => {
	onMount(() => {
		// Load the controls state from localStorage
		try {
			const state = localStorage.getItem(LOCAL_STORAGE_KEY);
			const localState = JSON.parse(state ?? "{}"); // oxlint-disable-line no-unsafe-argument no-unsafe-assignment
			Object.assign(controls, localState);
		} catch (error) {
			console.error(error);
		}

		addEventListener("keydown", handleKeyDown);

		onCleanup(() => {
			removeEventListener("keydown", handleKeyDown);
		});
	});

	const handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key === "Escape") {
			internal.hideMenu = !internal.hideMenu;
		}

		if (event.key === " ") {
			controls.paused = !controls.paused;
		}
	};

	// Save the value of the controls to localStorage to persist between sessions
	createEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(controls));
	});

	return (
		<div
			class="absolute top-0 left-0 m-2 flex max-h-[calc(100%-0.5rem)] w-96 translate-x-[calc(-100%-0.5rem)] flex-col gap-2 overflow-y-auto bg-white p-2 text-black transition-transform duration-300 [-ms-overflow-style:none] [-webkit-scrollbar-width:none] [scrollbar-width:none] data-menu:translate-x-0"
			data-menu={internal.hideMenu ? undefined : ""}
		>
			<General />

			<Sketch />
		</div>
	);
};

export { Controls };
