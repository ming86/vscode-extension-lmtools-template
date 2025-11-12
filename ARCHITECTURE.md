# Architecture

This document explains the modular architecture of the LM Tools extension template.

## Documentation Overview

This template includes three complementary documentation files:

| File | Audience | Purpose |
|------|----------|---------|
| **[README.md](./README.md)** | End Users | User-facing marketplace documentation describing features, installation, and usage |
| **[DEVELOPING.md](./DEVELOPING.md)** | Developers | Developer guide for building, testing, and extending the extension |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Developers | Technical architecture, design principles, and project structure |

When you customize this template for your extension, update README.md with your tool's specific features and use cases.

## Directory Structure

```text
src/
├── extension.ts              # Main extension entry point - handles registration only
├── commands/                 # Command handlers
│   └── helloWorld.ts        # Example command implementation
├── tools/                    # Language Model Tools
│   └── getCurrentTimeTool.ts # Example LM tool implementation
├── services/                 # Business logic and API integration
│   └── (your services here)
├── utils/                    # Utility functions
│   └── (your utilities here)
└── types/                    # TypeScript type definitions
    └── index.ts             # Shared interfaces and types
```

## Design Principles

### 1. Separation of Concerns

Each directory has a specific responsibility:

- **extension.ts**: Minimal entry point that only handles registration of tools, commands, and event handlers. No business logic.
- **commands/**: Command handlers isolated from business logic. Each command is in its own file.
- **tools/**: LM tool implementations separate from API logic. Each tool is self-contained.
- **services/**: API integration and business logic that can be shared across tools and commands.
- **utils/**: Reusable utility functions that don't belong to a specific domain.
- **types/**: Centralized type definitions to ensure type safety across the extension.

### 2. Single Responsibility

Each file should have a single, well-defined purpose:

- One tool per file in `tools/`
- One command handler per file in `commands/`
- Related service logic grouped in `services/`
- Generic utilities in `utils/`

### 3. Dependency Flow

```text
extension.ts
    ↓
commands/ ← → services/ ← → utils/
    ↓           ↓
tools/    ← → types/
```

- `extension.ts` imports and registers components
- `commands/` and `tools/` may use `services/` for business logic
- `services/` may use `utils/` for common functionality
- All modules can import from `types/` for type definitions
- Avoid circular dependencies

### 4. Testability

The modular structure makes testing easier:

- Tools can be tested independently from the extension activation
- Commands can be tested by importing and calling their functions
- Services can be mocked when testing tools or commands
- Utilities can be unit tested in isolation

## Adding New Components

### Adding a New LM Tool

1. Create a new file in `tools/` (e.g., `myNewTool.ts`)
2. Export a class implementing `vscode.LanguageModelTool<T>`
3. Add the tool configuration to `package.json` under `contributes.languageModelTools`
4. Import and register the tool in `extension.ts`

Example:

```typescript
// tools/myNewTool.ts
import * as vscode from 'vscode';

export class MyNewTool implements vscode.LanguageModelTool<{}> {
    async prepareInvocation(...) { ... }
    async invoke(...) { ... }
}

// extension.ts
import { MyNewTool } from './tools/myNewTool';

export function activate(context: vscode.ExtensionContext) {
    const myTool = vscode.lm.registerTool('my_new_tool', new MyNewTool());
    context.subscriptions.push(myTool);
}
```

### Adding a New Command

1. Create a new file in `commands/` (e.g., `myCommand.ts`)
2. Export a function that implements the command logic
3. Add the command to `package.json` under `contributes.commands`
4. Import and register the command in `extension.ts`

Example:

```typescript
// commands/myCommand.ts
import * as vscode from 'vscode';

export function myCommand(): void {
    vscode.window.showInformationMessage('My command executed!');
}

// extension.ts
import { myCommand } from './commands/myCommand';

export function activate(context: vscode.ExtensionContext) {
    const cmd = vscode.commands.registerCommand('extension.myCommand', myCommand);
    context.subscriptions.push(cmd);
}
```

### Adding a Service

1. Create a new file in `services/` (e.g., `apiService.ts`)
2. Export functions or classes that encapsulate business logic
3. Import the service in tools or commands that need it

Example:

```typescript
// services/apiService.ts
export async function fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
}

// tools/dataTool.ts
import { fetchData } from '../services/apiService';

export class DataTool implements vscode.LanguageModelTool<{}> {
    async invoke(...) {
        const data = await fetchData('https://api.example.com/data');
        // ...
    }
}
```

### Adding Shared Types

1. Define interfaces and types in `types/index.ts`
2. Export them for use across the extension
3. Import from `../types` in any module that needs them

Example:

```typescript
// types/index.ts
export interface IToolParameters {
    query: string;
    limit?: number;
}

// tools/searchTool.ts
import * as vscode from 'vscode';
import { IToolParameters } from '../types';

export class SearchTool implements vscode.LanguageModelTool<IToolParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IToolParameters>, ...) {
        const { query, limit } = options.input;
        // ...
    }
}
```

## Best Practices

### 1. Keep extension.ts Minimal

The `extension.ts` file should only contain:

- Import statements
- Registration code in `activate()`
- Cleanup code in `deactivate()` (if needed)

All implementation details belong in their respective modules.

### 2. Use Descriptive File Names

- Tool files: Use the tool name in camelCase (e.g., `getCurrentTimeTool.ts`)
- Command files: Use the command action in camelCase (e.g., `helloWorld.ts`)
- Service files: Use the domain + "Service" (e.g., `apiService.ts`, `authService.ts`)

### 3. Document Your Code

Each file should have:

- A file-level comment explaining its purpose
- JSDoc comments for exported classes and functions
- Inline comments for complex logic

### 4. Maintain Type Safety

- Define types for all tool input parameters
- Use interfaces for complex data structures
- Avoid using `any` unless absolutely necessary

### 5. Handle Errors Gracefully

- Use try-catch blocks in tools and commands
- Provide user-friendly error messages
- Log errors for debugging with `console.error()`

## Migration from Monolithic Structure

If you have an existing extension with everything in `extension.ts`:

1. Create the directory structure
2. Extract tool classes to `tools/`
3. Extract command handlers to `commands/`
4. Move shared business logic to `services/`
5. Move utility functions to `utils/`
6. Define shared types in `types/`
7. Update `extension.ts` to import and register components
8. Test thoroughly to ensure nothing broke

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api/references/vscode-api)
- [Language Model Tools Guide](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy)
