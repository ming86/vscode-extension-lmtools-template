import * as vscode from 'vscode';

/**
 * LM Tool that returns the current date and time.
 * 
 * This tool demonstrates the minimal implementation of a Language Model Tool that can be:
 * - Invoked by agents automatically based on conversation context
 * - Referenced in prompts using #time
 * - Discovered by GitHub Copilot Chat
 * 
 * ## Key Concepts:
 * 
 * 1. **Tool Registration**: Tools must be registered in activate() using vscode.lm.registerTool()
 *    - The tool name must match the 'name' property in package.json
 *    - Registration returns a Disposable that should be added to context.subscriptions
 * 
 * 2. **Tool Interface**: Implements vscode.LanguageModelTool<T> where T is the input parameter type
 *    - prepareInvocation(): Called before tool execution to prepare and optionally request user confirmation
 *    - invoke(): Called to execute the tool and return results
 * 
 * 3. **Input Parameters**: Type-safe parameters defined by:
 *    - Interface/type definition in TypeScript (e.g., IGetTimeParameters)
 *    - JSON schema in package.json's inputSchema property
 *    - Parameters are validated against the schema before invoke() is called
 * 
 * 4. **Tool Results**: Return vscode.LanguageModelToolResult containing:
 *    - LanguageModelTextPart: Plain text content
 *    - LanguageModelPromptTsxPart: Structured TSX content (advanced)
 *    - Results should be clear and LLM-friendly for easy parsing
 * 
 * ## Extending This Example:
 * 
 * To add input parameters:
 * 1. Define an interface (e.g., interface IGetTimeParams { timezone?: string; format?: '12h' | '24h'; })
 * 2. Update the class to implement vscode.LanguageModelTool<IGetTimeParams>
 * 3. Add inputSchema to package.json with the parameter definitions
 * 4. Use options.input.parameterName in the invoke() method
 * 
 * To add confirmation messages:
 * - Return confirmationMessages in prepareInvocation() with title and message
 * - Users will see a dialog to approve/deny the tool invocation
 * - Users can choose "Always Allow" to skip future confirmations
 * 
 * ## Requirements:
 * - VS Code API version: ^1.105.0 or higher (for LM Tools support)
 * - Tool must be declared in package.json under contributes.languageModelTools
 * - Tool name format: {verb}_{noun} (e.g., get_current_time)
 * 
 * @see https://code.visualstudio.com/api/extension-guides/ai/tools
 * @see https://code.visualstudio.com/api/references/vscode-api#lm
 */
export class GetCurrentTimeTool implements vscode.LanguageModelTool<{}> {
	/**
	 * Prepares the tool for invocation. Called before invoke().
	 * 
	 * This method can:
	 * - Provide a custom invocation message shown to the user
	 * - Request user confirmation with custom title/message
	 * - Validate the input parameters (though they're already validated against schema)
	 * 
	 * @param options - Contains the validated input parameters
	 * @param token - Cancellation token to check if operation was cancelled
	 * @returns PreparedToolInvocation with optional confirmation and invocation messages
	 */
	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<{}>,
		token: vscode.CancellationToken
	): Promise<vscode.PreparedToolInvocation> {
		return {
			// Message shown while tool is executing
			invocationMessage: 'Getting current time'
			// Optional: Add confirmation dialog
			// confirmationMessages: {
			//   title: 'Get Current Time',
			//   message: 'Retrieve the current date and time?'
			// }
		};
	}

	/**
	 * Executes the tool and returns results.
	 * 
	 * This method:
	 * - Receives validated input parameters in options.input
	 * - Performs the tool's core functionality
	 * - Returns results as LanguageModelToolResult
	 * - Should throw errors with LLM-friendly messages if something goes wrong
	 * 
	 * @param options - Contains validated input parameters and tokenization options
	 * @param token - Cancellation token to check if operation was cancelled
	 * @returns LanguageModelToolResult containing the tool's output
	 * @throws Error with LLM-friendly message on failure
	 */
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<{}>,
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		// Get current date and time
		const now = new Date();
		
		// Format with locale-aware string including timezone
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
		
		// Return result as LanguageModelToolResult containing LanguageModelTextPart
		// The LLM will use this text as part of its response
		return new vscode.LanguageModelToolResult([
			new vscode.LanguageModelTextPart(`The current date and time is: ${timeString}`)
		]);
	}
}
