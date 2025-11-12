# Utilities

This directory contains reusable utility functions.

## Purpose

Utilities are:

- Pure functions when possible
- Generic and reusable across the extension
- Not tied to specific business logic or domains
- Simple and well-tested

## Examples

```typescript
// stringUtils.ts
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
}

// dateUtils.ts
export function formatDate(date: Date, format: string): string {
    // Implementation
}

// validators.ts
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
```

## Best Practices

- Keep functions pure (same input = same output)
- Document expected inputs and outputs
- Handle edge cases
- Write unit tests for utilities
