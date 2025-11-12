# VS Code Extension LM Tools Template - Developer Guide

This template provides a working example of a VS Code extension that implements a Language Model (LM) Tool. Use this as a reference and starting point for developing your own LM tools.

## Table of Contents

- [What is an LM Tool?](#what-is-an-lm-tool)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Implementation Guide](#implementation-guide)
- [Testing Your Tool](#testing-your-tool)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## What is an LM Tool?

A Language Model Tool is a function that can be invoked by AI agents (like GitHub Copilot) as part of processing a user's chat prompt. Tools enable the LLM to:

- Execute domain-specific operations
- Access VS Code APIs and workspace data
- Retrieve information from external sources
- Perform calculations or transformations

**Key Characteristics:**
- The LLM generates the parameters but never executes the tool directly
- Tools are discovered automatically by agent mode
- Users can reference tools in prompts using `#toolName`
- Tools can request user confirmation before execution

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- VS Code (v1.105.0 or higher) or VS Code Insiders
- TypeScript knowledge

### Installation & Setup

```bash
# Install dependencies
npm install

# Compile TypeScript to JavaScript
npm run compile

# Watch mode for development (recompiles on file changes)
npm run watch

# Run linter
npm run lint

# Run tests
npm test

# Build production package
npm run package
```

### Running the Example

### Option 1: Launch Extension Development Host (Recommended)

1. Press `F5` in VS Code to launch Extension Development Host
2. Open GitHub Copilot Chat
3. Try these prompts:
   - "What time is it?" (agent mode will invoke automatically)
   - "Use #time to get the current time" (explicit reference)

### Option 2: Install from VSIX file

```bash
# Create VSIX package
npm run package

# Install in VS Code
code --install-extension example-lm-tools-0.0.1.vsix

# Install in VS Code Insiders
code-insiders --install-extension example-lm-tools-0.0.1.vsix

# Uninstall extension
code --uninstall-extension ming86.example-lm-tools
code-insiders --uninstall-extension ming86.example-lm-tools
```

### Available npm Commands

| Command | Purpose |
|---------|---------|
| `npm run compile` | Compile TypeScript to JavaScript (one-time) |
| `npm run watch:esbuild` | Watch for file changes and rebuild automatically |
| `npm run watch:tsc` | Type-check in watch mode |
| `npm run watch` | Run both esbuild and tsc in watch mode (recommended during development) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run check-types` | Type-check without emitting files |
| `npm test` | Run test suite |
| `npm run package` | Build production-ready VSIX package |
| `npm run vscode:prepublish` | Prepare for VS Code Marketplace publication |

## Architecture Overview

### Project Structure

This template follows a modular architecture. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

```text
src/
├── extension.ts              # Entry point - handles registration only
├── commands/                 # Command handlers
├── tools/                    # Language Model Tools
├── services/                 # Business logic and API integration
├── utils/                    # Utility functions
└── types/                    # TypeScript type definitions
```

### Tool Components

```
package.json                    →  Static tool definition
    ↓
extension.ts (activate)         →  Tool registration  
    ↓
GetCurrentTimeTool class        →  Tool implementation
    ├─ prepareInvocation()      →  Validation & confirmation
    └─ invoke()                 →  Execute & return results
```

### Tool Invocation Flow

1. **User sends prompt** → Agent mode analyzes available tools
2. **LLM selects tool** → Generates parameters based on tool schema
3. **prepareInvocation()** → Validates parameters, optionally requests confirmation
4. **User confirms** → (if confirmationMessages was returned)
5. **invoke()** → Executes tool logic and returns results
6. **LLM processes results** → Incorporates into final response

## Implementation Guide

### Step 1: Define Tool in package.json

Add your tool under `contributes.languageModelTools`:

```json
{
  "name": "get_current_time",
  "displayName": "Get Current Time",
  "modelDescription": "Returns the current date and time. Use this when the user asks about the current time, date, or needs to know 'what time is it' or 'what's the date today'.",
  "canBeReferencedInPrompt": true,
  "toolReferenceName": "time"
}
```

**Key Properties:**

| Property | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Unique identifier, format: `{verb}_{noun}` |
| `displayName` | Yes | User-facing name shown in UI |
| `modelDescription` | Yes | Detailed description for LLM to understand when/how to use the tool |
| `canBeReferencedInPrompt` | No | Set to `true` to allow `#` references and agent mode usage |
| `toolReferenceName` | No | Name for users to reference the tool via `#` |
| `inputSchema` | No | JSON Schema for parameter validation |
| `when` | No | Context clause to control tool availability |

### Step 2: Create Tool Class

Implement `vscode.LanguageModelTool<T>`:

```typescript
class GetCurrentTimeTool implements vscode.LanguageModelTool<{}> {
  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<{}>,
    token: vscode.CancellationToken
  ): Promise<vscode.PreparedToolInvocation> {
    return {
      invocationMessage: 'Getting current time'
    };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<{}>,
    token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    const now = new Date();
    const timeString = now.toLocaleString();
    
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(`Current time: ${timeString}`)
    ]);
  }
}
```

### Step 3: Register Tool in activate()

```typescript
export function activate(context: vscode.ExtensionContext) {
  const tool = vscode.lm.registerTool(
    'get_current_time',  // Must match package.json name
    new GetCurrentTimeTool()
  );
  context.subscriptions.push(tool);
}
```

## Testing Your Tool

### Manual Testing

1. Press `F5` to launch Extension Development Host
2. Open Copilot Chat
3. Test scenarios:
   - Automatic invocation: "What time is it?"
   - Explicit reference: "Use #time to check current time"
   - Edge cases: Test error conditions

### Debugging

Check the Debug Console for:
- Extension activation messages
- Tool registration confirmation
- Any runtime errors

### Development Workflows

#### Hot Reload During Development

```bash
# Terminal 1: Watch TypeScript and rebuild on changes
npm run watch

# Terminal 2: (In VS Code) Press F5 to launch Extension Development Host
# Code changes will be compiled automatically, reload extension (Ctrl+R) to test
```

#### Testing and Linting

```bash
# Check code quality
npm run lint

# Fix linting errors automatically
npm run lint -- --fix

# Type-check (without compilation)
npm run check-types

# Run test suite
npm test

# Run tests in watch mode (if supported)
npm run watch-tests
```

#### Building for Distribution

```bash
# Create production-ready package
npm run package
npm run compile && npm run package && npm run vsce:package

# This creates a .vsix file that can be:
# 1. Installed locally with: code --install-extension <file.vsix>
# 2. Published to VS Code Marketplace
# 3. Shared with users for manual installation
```

#### VS Code Command Line Interface

```bash
# List installed extensions
code --list-extensions

# List installed extensions with versions
code --list-extensions --show-versions

# Install multiple extensions
code --install-extension <publisher>.<name> --install-extension <publisher>.<name>

# Uninstall extension
code --uninstall-extension <publisher>.<name>

# Open project in VS Code
code /path/to/project

# Open VS Code Insiders instead
code-insiders --install-extension example-lm-tools-0.0.1.vsix

# Run tests from command line
code --extensionDevelopmentPath=/path/to/extension --extensionTestsPath=/path/to/test /path/to/workspace
```

## Best Practices

### Naming Conventions

- **Tool names**: Use `{verb}_{noun}` format (e.g., `get_weather`, `search_files`)
- **Display names**: Clear, user-friendly (e.g., "Get Weather", "Search Files")
- **Tool reference names**: Short, memorable (e.g., "weather", "search")

### Writing Descriptions

For `modelDescription`, include:
- What the tool does
- What information it returns
- When it should/shouldn't be used
- Important limitations

**Example:**
```json
"modelDescription": "Returns weather information for a specified location. Use when the user asks about current weather, forecasts, or weather conditions. Returns temperature, conditions, and humidity. Only works for locations in the United States."
```

### Error Handling

```typescript
async invoke(options, token): Promise<vscode.LanguageModelToolResult> {
  try {
    // Tool logic
  } catch (error) {
    // Throw LLM-friendly errors with guidance
    throw new Error(
      `Unable to fetch data: ${error.message}. ` +
      `Please check the input and try again.`
    );
  }
}
```

### Adding Input Parameters

1. **Define interface:**
```typescript
interface ISearchParams {
  query: string;
  fileType?: 'typescript' | 'javascript' | 'all';
}
```

2. **Add schema to package.json:**
```json
"inputSchema": {
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Search query string"
    },
    "fileType": {
      "type": "string",
      "enum": ["typescript", "javascript", "all"],
      "description": "File type filter"
    }
  },
  "required": ["query"]
}
```

3. **Use in tool:**
```typescript
class SearchTool implements vscode.LanguageModelTool<ISearchParams> {
  async invoke(options, token) {
    const { query, fileType = 'all' } = options.input;
    // Use parameters...
  }
}
```

### Adding User Confirmation

```typescript
async prepareInvocation(
  options: vscode.LanguageModelToolInvocationPrepareOptions<T>,
  token: vscode.CancellationToken
): Promise<vscode.PreparedToolInvocation> {
  return {
    invocationMessage: 'Executing tool...',
    confirmationMessages: {
      title: 'Confirm Action',
      message: new vscode.MarkdownString(
        `Execute action with: \`${options.input.param}\`?`
      )
    }
  };
}
```

## API Reference

### Core Interfaces

#### LanguageModelTool<T>
```typescript
interface LanguageModelTool<T> {
  prepareInvocation(
    options: LanguageModelToolInvocationPrepareOptions<T>,
    token: CancellationToken
  ): ProviderResult<PreparedToolInvocation>;
  
  invoke(
    options: LanguageModelToolInvocationOptions<T>,
    token: CancellationToken
  ): ProviderResult<LanguageModelToolResult>;
}
```

#### LanguageModelToolResult
```typescript
class LanguageModelToolResult {
  constructor(
    content: Array<LanguageModelTextPart | LanguageModelPromptTsxPart>
  );
}
```

#### PreparedToolInvocation
```typescript
interface PreparedToolInvocation {
  invocationMessage?: string | MarkdownString;
  confirmationMessages?: {
    title: string;
    message: string | MarkdownString;
  };
}
```

### Registration

```typescript
vscode.lm.registerTool(
  name: string,
  tool: LanguageModelTool<T>
): Disposable
```

### Further Reading

- [VS Code LM Tools Guide](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [VS Code LM API Reference](https://code.visualstudio.com/api/references/vscode-api#lm)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)

---

**Need Help?**
- [VS Code API Documentation](https://code.visualstudio.com/api)
- [GitHub Issues](https://github.com/microsoft/vscode/issues)
