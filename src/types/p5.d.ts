declare module "p5" {
	// oxlint-disable-next-line typescript/consistent-type-imports
	type P5Constructor = typeof import("../../node_modules/p5/types/p5").default;

	declare const P5: P5Constructor;

	export default P5;
}
