// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * LM Tool that returns the current date and time.
 * This tool can be invoked by agents and referenced in prompts using #time
 */
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
		const timeString = now.toLocaleString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short'
		});
		return new vscode.LanguageModelToolResult([
			new vscode.LanguageModelTextPart(`The current date and time is: ${timeString}`)
		]);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "example-lm-tools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// Register the LM tool
	const tool = vscode.lm.registerTool('get_current_time', new GetCurrentTimeTool());
	context.subscriptions.push(tool);

	const disposable = vscode.commands.registerCommand('example-lm-tools.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Example LM Tools!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
