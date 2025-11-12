/**
 * Shared type definitions for the extension.
 * 
 * This file contains common interfaces and types used across the extension.
 * Centralizing types here promotes type safety and code reusability.
 */

/**
 * Input parameters for the getCurrentTime Language Model Tool.
 * 
 * This interface defines the schema for tool inputs that are validated against
 * the JSON schema defined in package.json under inputSchema.
 * 
 * @property format - The time format: '12h' (12-hour) or '24h' (24-hour)
 * @property includeTimezone - Whether to include timezone information in the output
 */
export interface IGetTimeParameters {
  format?: '12h' | '24h';
  includeTimezone?: boolean;
}
