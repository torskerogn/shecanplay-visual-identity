# Canvas Starter

This is a starter template for canvas projects. It uses Solid.js for the UI and P5.js for the canvas.

## Features

- Solid.js for the UI
- P5.js for the graphics
- Tailwind CSS for the styling
- Vite for the build system
- Bun for the package management

## Installation

Use Bun to install the dependencies.
Why do we need to install the dependencies?
Because our code depends on other packages of code.
Bun is (among other things) a package manager that allows us to install and manage dependencies.

```bash
bun install
```

## Development

To launch the development server, run the following command.

```bash
bun run dev
```

## Build

To build the project locally, run the following command.
This will create a `dist` folder with the built project.
This is what Netlify does on its servers when you deploy your project.

```bash
bun run build
```

## Preview

To preview the project, run the following command.
This will start a local server and open the project in your browser.

```bash
bun run preview
```

## Reinstall

To reinstall the dependencies, run the following command.
This will remove the `bun.lock` file and reinstall the dependencies.

```bash
bun run reinstall
```

## Update

To update the dependencies, run the following command.
This will update the dependencies to the latest version.

```bash
bun run update
```
