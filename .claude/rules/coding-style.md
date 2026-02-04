# Coding Style Rules

## TypeScript
- Strict mode enabled
- No `any` types
- Explicit return types for functions

## Formatting
- Prettier (auto-format on save)
- 2 spaces indentation
- Single quotes

## Naming
- Components: PascalCase (`ConversationWidget.tsx`)
- Files: kebab-case (`encryption.ts`)
- Variables: camelCase (`userId`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)

## React
- Server Components by default
- Client Components: add `'use client'`
- Props: TypeScript interfaces

## Example
```typescript
'use client';

interface Props {
  userId: string;
  onComplete: (result: AnalysisResult) => void;
}

export function ConversationWidget({ userId, onComplete }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  return <div>{/* ... */}</div>;
}
```
