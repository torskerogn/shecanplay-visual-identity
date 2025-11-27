import type { VoidComponent } from "solid-js";
import { pipe, step } from "../../scripts/lib";

interface Props {
	label: string;
	min?: number;
	max?: number;
	step?: number;
	value: number;
	onChange: (value: number) => void;
}

/** Adds a number input to the UI */
const NumberInput: VoidComponent<Props> = (props) => (
	<label class="shadow-menu grid *:col-1 *:row-1">
		<span class="whitespace-nowrap">{props.label}</span>

		<input
			type="number"
			class="h-3 w-full text-right"
			value={props.value}
			name={props.label}
			min={props.min}
			max={props.max}
			step={props.step}
			onChange={(event) => {
				props.onChange(
					pipe(
						Number(event.currentTarget.value),
						(value) => Math.max(props.min ?? -Infinity, value),
						(value) => Math.min(props.max ?? Infinity, value),
						(value) => step(value, props.step ?? 1),
					),
				);
			}}
		/>
	</label>
);

export { NumberInput };
