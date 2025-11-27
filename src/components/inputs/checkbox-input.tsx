import type { VoidComponent } from "solid-js";

interface Props {
	name: string;
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

/** Adds a checkbox input to the UI */
const CheckboxInput: VoidComponent<Props> = (props) => (
	<label class="shadow-menu clickable flex items-center">
		<input
			type="checkbox"
			checked={props.value}
			name={props.name}
			onChange={(event) => {
				props.onChange(event.target.checked);
			}}
		/>

		<span>{props.label}</span>
	</label>
);

export { CheckboxInput };
