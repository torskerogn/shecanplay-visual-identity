import type { VoidComponent } from "solid-js";
import { pipe, step, truncate } from "../../scripts/lib";

interface Props {
	label: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onChange: (value: number) => void;
}

/** Adds a range slider input to the UI */
const RangeInput: VoidComponent<Props> = (props) => (
	<div class="flex flex-col gap-[0.5px]">
		<label class="shadow-menu grid *:col-1 *:row-1">
			<span class="whitespace-nowrap">{props.label}</span>

			<input
				type="text"
				value={props.value}
				name={props.label}
				class="h-3 flex-1 text-right"
				autocomplete="off"
				onKeyDown={(event) => {
					const increasing = event.key === "ArrowUp" || event.key === "ArrowRight";
					const decreasing = event.key === "ArrowDown" || event.key === "ArrowLeft";

					if (!increasing && !decreasing) {
						return;
					}

					event.preventDefault();
					event.stopPropagation();

					const stepSize = props.step * (event.shiftKey ? 10 : 1);

					props.onChange(
						pipe(
							Number(event.currentTarget.value),
							(value) => value + (increasing ? stepSize : -stepSize),
							(value) => Math.max(props.min, value),
							(value) => Math.min(props.max, value),
							(value) => step(value, props.step),
							(value) => truncate(value, 3),
						),
					);
				}}
				onChange={(event) => {
					props.onChange(
						pipe(
							Number(event.currentTarget.value),
							(value) => Math.max(props.min, value),
							(value) => Math.min(props.max, value),
							(value) => step(value, props.step),
							(value) => truncate(value, 3),
						),
					);
				}}
			/>
		</label>

		<input
			type="range"
			class="shadow-menu"
			min={props.min}
			max={props.max}
			step={props.step}
			value={props.value}
			name={props.label}
			aria-label={props.label}
			onInput={(event) => {
				props.onChange(
					pipe(
						Number(event.currentTarget.value),
						(value) => Math.max(props.min, value),
						(value) => Math.min(props.max, value),
						(value) => step(value, props.step),
						(value) => truncate(value, 3),
					),
				);
			}}
		/>
	</div>
);

export { RangeInput };
