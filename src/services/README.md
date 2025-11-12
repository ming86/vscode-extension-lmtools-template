# Services

This directory contains business logic and API integration code.

## Purpose

Services encapsulate:

- API calls to external services
- Complex business logic shared across tools and commands
- Data transformation and processing
- Authentication and authorization logic

## Examples

```typescript
// apiService.ts - Example API service
export async function fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
}

// authService.ts - Example authentication service
export class AuthService {
    async getToken(): Promise<string> {
        // Implementation
    }
}
```

## Best Practices

- Keep services focused on a single responsibility
- Return typed data (avoid `any` when possible)
- Handle errors gracefully
- Make services testable by avoiding tight coupling
