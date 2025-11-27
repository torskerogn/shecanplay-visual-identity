import type { VoidComponent } from "solid-js";

interface Props {
	name: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
}

/** Adds a text input to the UI */
const TextInput: VoidComponent<Props> = (props) => (
	<label class="flex flex-col">
		<span>{props.label}</span>

		<input
			type="text"
			value={props.value}
			name={props.name}
			class="shadow-menu h-3 w-full"
			autocomplete="off"
			onChange={(event) => {
				props.onChange(event.target.value);
			}}
		/>
	</label>
);

export { TextInput };
