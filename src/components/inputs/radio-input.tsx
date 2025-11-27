import type { VoidComponent } from "solid-js";
import { For } from "solid-js";

interface Option {
	label?: string;
	value: string;
	checked: boolean;
	onChange: (value: string) => void;
}

interface Props {
	options: Option[];
	name: string;
	title: string;
}

/** Adds a radio input to the UI */
const RadioInput: VoidComponent<Props> = (props) => (
	<div class="flex flex-col">
		<span>{props.title}</span>

		<ul class="shadow-menu flex gap-[1ch]">
			<For each={props.options}>
				{(option) => (
					<li>
						<label class="clickable flex items-center justify-between not-has-checked:opacity-50 has-focus-visible:[outline:1px_solid_hsl(0,100%,50%)]">
							<span>{option.label ?? option.value}</span>

							<input
								type="radio"
								name={props.name}
								class="sr-only"
								checked={option.checked}
								onChange={() => {
									option.onChange(option.value);
								}}
							/>
						</label>
					</li>
				)}
			</For>
		</ul>
	</div>
);

export { RadioInput };
