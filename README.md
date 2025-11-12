# Example LM Tools VS Code Extension

A template for building VS Code extensions with Language Model (LM) Tools. This template demonstrates best practices for creating AI-powered extensions with a clean, modular architecture.

## Features

- **LM Tools Support**: Includes an example tool (`get_current_time`) that can be invoked by GitHub Copilot Chat and AI agents
- **Modular Architecture**: Well-organized code structure with separation of concerns
- **TypeScript**: Full TypeScript support with type safety
- **Modern Build**: Uses esbuild for fast compilation
- **Example Command**: Includes a sample command to help you get started

## Project Structure

This template follows a modular architecture to keep code organized and maintainable:

```text
src/
├── extension.ts              # Entry point - handles registration only
├── commands/                 # Command handlers
│   └── helloWorld.ts
├── tools/                    # Language Model Tools
│   └── getCurrentTimeTool.ts
├── services/                 # Business logic and API integration
├── utils/                    # Utility functions
└── types/                    # TypeScript type definitions
    └── index.ts
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- VS Code 1.101.0 or higher
- Git

### Installation

1. Clone this repository or use it as a template
2. Install dependencies:

   ```bash
   npm install
   ```

### Development

1. Open the project in VS Code
2. Press `F5` to open a new Extension Development Host window
3. The extension will be automatically loaded

### Building

```bash
# Development build
npm run compile

# Watch mode (automatically rebuilds on changes)
npm run watch

# Production build
npm run package
```

### Testing the LM Tool

1. Open the Extension Development Host window (press `F5`)
2. Open GitHub Copilot Chat
3. Reference the tool in your prompt using `#time`
4. The tool will also be automatically invoked by agents when they need the current time

## Extending This Template

### Adding a New LM Tool

1. Create a new file in `src/tools/` (e.g., `myTool.ts`)
2. Implement the `vscode.LanguageModelTool` interface
3. Add the tool configuration to `package.json` under `contributes.languageModelTools`
4. Register the tool in `src/extension.ts`

See [ARCHITECTURE.md](./ARCHITECTURE.md#adding-a-new-lm-tool) for detailed instructions.

### Adding a New Command

1. Create a new file in `src/commands/` (e.g., `myCommand.ts`)
2. Export a function that implements the command logic
3. Add the command to `package.json` under `contributes.commands`
4. Register the command in `src/extension.ts`

See [ARCHITECTURE.md](./ARCHITECTURE.md#adding-a-new-command) for detailed instructions.

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api/references/vscode-api)
- [Language Model Tools Guide](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## License

See [LICENSE](./LICENSE) file for details.


