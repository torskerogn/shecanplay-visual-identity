import type { ParentComponent } from "solid-js";

interface Props {
	title: string;
	open?: boolean;
}

/** Adds a folder to the UI */
const Folder: ParentComponent<Props> = (props) => (
	<details class="shadow-menu group" open={props.open}>
		<summary class="clickable flex items-center justify-between">
			<span>{props.title}</span>
			<span class="after:content-['+'] group-open:after:content-['–']"></span>
		</summary>

		<div class="flex flex-col gap-y-3 p-2">{props.children}</div>
	</details>
);

export { Folder };
