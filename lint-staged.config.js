/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
	"main/**/*.{ts,js}": (files) => {
		const rel = files.join(" ");
		return rel
			? [`npx biome check --write ${rel}`, `npx biome format --write ${rel}`]
			: [];
	},
	"renderer/**/*.{ts,tsx,js,jsx}": (files) => {
		const rel = files.join(" ");
		return rel
			? [`npx biome check --write ${rel}`, `npx biome format --write ${rel}`]
			: [];
	},
	"shared/**/*.{ts,tsx,js,jsx}": (files) => {
		const rel = files.join(" ");
		return rel
			? [`npx biome check --write ${rel}`, `npx biome format --write ${rel}`]
			: [];
	},
};
