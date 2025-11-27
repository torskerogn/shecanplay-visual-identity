import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// oxlint-disable no-default-export

export default defineConfig({ plugins: [solid(), tailwindcss()], server: { port: 3191 } });
