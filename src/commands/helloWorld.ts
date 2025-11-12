import * as vscode from 'vscode';

/**
 * Handler for the 'helloWorld' command.
 * 
 * This demonstrates a simple command handler that displays a message to the user.
 * Commands are registered in extension.ts and can be invoked:
 * - From the Command Palette (Cmd/Ctrl+Shift+P)
 * - Via keyboard shortcuts
 * - Programmatically from other extensions or code
 * 
 * @see https://code.visualstudio.com/api/references/vscode-api#commands
 */
export function helloWorldCommand(): void {
	vscode.window.showInformationMessage('Hello World from Example LM Tools!');
}
