import type { VoidComponent } from "solid-js";
import { render } from "solid-js/web";
import "../styles/global.css"; // oxlint-disable-line no-unassigned-import
import { Controls } from "./controls";
import { P5 } from "./p5";

/** Main app component */
const App: VoidComponent = () => (
	<div class="bg-grid fixed inset-0 text-xs leading-3 uppercase">
		<P5 />

		<Controls />
	</div>
);

// Render the app to the root element
const rootElement = document.querySelector("#root");
if (rootElement instanceof HTMLElement) {
	render(() => <App />, rootElement);
}
