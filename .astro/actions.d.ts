declare module "astro:actions" {
	type Actions = typeof import("/workspaces/theadpharm.com/src/actions/index.ts")["server"];

	export const actions: Actions;
}