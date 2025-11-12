import * as vscode from 'vscode';

// Import tools
import { GetCurrentTimeTool } from './tools/getCurrentTimeTool';

// Import commands
import { helloWorldCommand } from './commands/helloWorld';

/**
 * Extension activation entry point.
 * 
 * This function is called when your extension is activated.
 * It handles registration of:
 * - Language Model Tools
 * - Commands
 * - Event handlers
 * 
 * All business logic is separated into respective modules:
 * - tools/: LM tool implementations
 * - commands/: Command handlers
 * - services/: API integration and business logic
 * - utils/: Utility functions
 * - types/: Type definitions
 * 
 * @param context - Extension context provided by VS Code
 * @see ARCHITECTURE.md for detailed architecture documentation
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Activating extension "example-lm-tools"');

	// Register Language Model Tools
	// Tool name must match 'name' in package.json under contributes.languageModelTools
	const getCurrentTimeTool = vscode.lm.registerTool('get_current_time', new GetCurrentTimeTool());
	context.subscriptions.push(getCurrentTimeTool);

	// Register Commands
	// Command ID must match 'command' in package.json under contributes.commands
	const helloWorld = vscode.commands.registerCommand('example-lm-tools.helloWorld', helloWorldCommand);
	context.subscriptions.push(helloWorld);

	console.log('Extension "example-lm-tools" is now active');
}

/**
 * Extension deactivation cleanup.
 * 
 * This function is called when your extension is deactivated.
 * Use it to clean up resources if needed.
 */
export function deactivate() {}
