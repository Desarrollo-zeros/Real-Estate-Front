# Frontend Architecture

## Overview

This frontend follows **Clean Architecture** principles and is built with **Next.js 15** using the **App Router**. The architecture ensures maintainability, scalability, and testability with a modern React 19 foundation.

## Core Principles

### 1. Separation of Concerns
- **UI Layer**: Components focused on presentation
- **Business Logic**: Custom hooks and services
- **State Management**: Zustand stores for global state
- **API Layer**: Service modules with clear boundaries

### 2. Dependency Rule
Dependencies flow inward:
```
Next.js App Router → UI Components → Hooks → Services → API Client
```

### 3. Type Safety
- All components use TypeScript
- DTOs match backend API contracts
- Strict type checking enabled

## Layer Breakdown

### Presentation Layer
**Location**: `src/app/`, `src/components/`

**Responsibility**: Display data and handle user interactions

**Components**:
- **App Router**: Next.js 15 file-based routing
- **Route Groups**: (auth), (dashboard) for logical grouping
- **Layout**: Structural components (Sidebar, Header)
- **UI**: Reusable primitives (Button, Card, Input) using Radix UI
- **Guards**: Route protection logic

### Application Layer
**Location**: `src/hooks/`, `src/store/`

**Responsibility**: Application logic and state management

**Modules**:
- **Hooks**: Encapsulate component logic (`useAuth`, `useToast`)
- **Stores**: Global state with Zustand (`useAuthStore`, `useUIStore`)

### Infrastructure Layer
**Location**: `src/services/`

**Responsibility**: External integrations and data access

**Modules**:
- **API Client**: Axios instance with interceptors
- **Services**: Domain-specific API calls (auth, property, owner)

### Domain Layer
**Location**: `src/types/`, `src/utils/`

**Responsibility**: Business entities and rules

**Modules**:
- **Types**: DTOs and interfaces
- **Constants**: App-wide configuration
- **Helpers**: Pure utility functions

## Data Flow

### Request Flow (Create Property)
```
1. User submits form → PropertyForm component
2. Component calls propertyService.createProperty()
3. Service sends POST request via apiClient
4. apiClient attaches JWT token (interceptor)
5. Backend responds with created property
6. Service returns typed PropertyDto
7. Component updates UI and shows toast
```

### Authentication Flow
```
1. User enters credentials → Login page
2. Login calls authService.login()
3. authService sends POST to /auth/token
4. Backend returns JWT + user info
5. Token stored in localStorage
6. useAuthStore updates isAuthenticated state
7. User redirected to dashboard
8. All subsequent requests include token
```

### State Management Flow
```
1. Component accesses store → useAuthStore()
2. Component reads state → const { user } = useAuthStore()
3. Component calls action → login(credentials)
4. Store updates state → set({ user, isAuthenticated: true })
5. All components re-render with new state
```

## Key Design Patterns

### 1. Repository Pattern
Services act as repositories for domain entities:
```typescript
// Property repository
export const propertyService = {
  getProperties(filters): Promise<PaginatedResponse<PropertyDto>>,
  getPropertyById(id): Promise<PropertyDto>,
  createProperty(data): Promise<PropertyDto>,
  updateProperty(id, data): Promise<PropertyDto>,
  deleteProperty(id): Promise<void>
}
```

### 2. Guard Pattern
Route protection with Next.js middleware and client components:
```typescript
// middleware.ts - Server-side protection
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  if (!token) return NextResponse.redirect('/login')
}

// Client-side protection
<ProtectedRoute requiredRoles={['Admin', 'Editor']}>
  <PropertyForm />
</ProtectedRoute>
```

### 3. Container/Presenter Pattern
- **Container**: Pages that fetch data and manage state
- **Presenter**: UI components that receive props

### 4. Composition Pattern
Build complex UIs from simple components:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Properties</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### 5. Custom Hooks Pattern
Extract reusable logic:
```typescript
const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  return { user, login, logout };
};
```

## State Management Strategy

### Local State (useState)
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific data

### Global State (Zustand)
- Authentication state
- UI preferences (theme, sidebar)
- Toast notifications

### Server State (React Query - Future)
- Cached API responses
- Background refetching
- Optimistic updates

## Error Handling

### API Errors
```typescript
// Centralized error handling in apiClient
interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(normalizeError(error));
  }
);
```

### Component Errors
```typescript
try {
  await propertyService.createProperty(data);
  toast.success('Property created');
} catch (error) {
  toast.error('Failed to create property');
  console.error(error);
}
```

### Validation Errors
```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};
  if (!formData.name) {
    errors.name = 'Name is required';
  }
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

## Performance Optimizations

### Code Splitting
Next.js automatically code-splits at the route level:
```typescript
// Automatic with Next.js App Router
// Manual dynamic imports when needed
const PropertyList = dynamic(() => import('./components/PropertyList'), {
  loading: () => <Loading />
});
```

### Memoization
```typescript
const filteredProperties = useMemo(
  () => properties.filter(p => p.price > minPrice),
  [properties, minPrice]
);
```

### Debouncing
```typescript
const handleSearch = debounce((term: string) => {
  setFilters({ ...filters, name: term });
}, 500);
```

## Security Measures

### 1. JWT Storage
- Tokens stored in `localStorage`
- Auto-cleared on logout
- Checked on app load

### 2. Route Protection
- `ProtectedRoute` wrapper
- Role-based access control
- Redirect to login if unauthorized

### 3. XSS Prevention
- React escapes by default
- No `dangerouslySetInnerHTML`
- Input validation with Zod

### 4. HTTPS Only
- API calls over HTTPS
- Secure cookie flags (future)

## Testing Strategy

### Unit Tests
- Utility functions
- Custom hooks
- Service modules

### Component Tests
- User interactions
- Props validation
- Conditional rendering

### Integration Tests
- API service integration
- Authentication flow
- Route navigation

## Future Enhancements

### 1. Server Components & React Query
Leverage Next.js Server Components and React Query:
- Server Components for initial data fetching
- React Query for client-side mutations
- Automatic caching and revalidation
- Optimistic updates

### 2. Virtualization
For large lists:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 3. Offline Support
- Service workers
- IndexedDB caching
- Sync on reconnect

### 4. Micro-Frontend
Split into independent modules:
- Properties module
- Owners module
- Dashboard module

### 5. Internationalization (i18n)
- Multi-language support
- Date/currency formatting
- RTL support

## Folder Conventions

### Naming
- **PascalCase**: Components, pages (`PropertyList.tsx`)
- **camelCase**: Hooks, utilities (`useAuth.ts`, `helpers.ts`)
- **kebab-case**: CSS files (`property-list.module.css`)

### File Organization
```
ComponentName/
├── index.ts           # Exports
├── ComponentName.tsx  # Main component
├── ComponentName.test.tsx  # Tests
└── types.ts          # Component-specific types
```

## Best Practices

### 1. Single Responsibility
Each component/function does one thing well.

### 2. DRY (Don't Repeat Yourself)
Extract common logic into hooks and utilities.

### 3. Explicit Over Implicit
Clear prop types and function signatures.

### 4. Fail Fast
Validate early, handle errors gracefully.

### 5. Progressive Enhancement
Core functionality works first, enhancements added.

---

This architecture ensures the frontend is maintainable, testable, and ready for future enhancements.
