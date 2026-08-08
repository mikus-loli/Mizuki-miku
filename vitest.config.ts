import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@components": path.resolve(__dirname, "src/components"),
			"@assets": path.resolve(__dirname, "src/assets"),
			"@constants": path.resolve(__dirname, "src/constants"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@i18n": path.resolve(__dirname, "src/i18n"),
			"@layouts": path.resolve(__dirname, "src/layouts"),
		},
	},
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.ts"],
	},
});
