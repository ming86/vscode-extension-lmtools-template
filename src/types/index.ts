/**
 * Shared type definitions for the extension.
 * 
 * This file contains common interfaces and types used across the extension.
 * Centralizing types here promotes type safety and code reusability.
 */

/**
 * Example interface for tool input parameters.
 * 
 * When adding input parameters to your LM tools:
 * 1. Define the interface here
 * 2. Update your tool class to implement vscode.LanguageModelTool<YourInterface>
 * 3. Add corresponding inputSchema to package.json
 * 
 * Example:
 * ```typescript
 * export interface IGetTimeParameters {
 *   timezone?: string;
 *   format?: '12h' | '24h';
 * }
 * ```
 */

// Export your interfaces and types here
export {};
