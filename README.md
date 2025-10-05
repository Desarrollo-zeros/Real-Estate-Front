# Real Estate Management System - Frontend

A modern, production-ready Next.js application for managing real estate properties, built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. This frontend seamlessly integrates with the .NET 9 Clean Architecture backend.

## 🎯 Features

- **🔐 JWT Authentication** with role-based access control (Admin, Editor, Viewer)
- **🏢 Property Management** - Full CRUD operations with filtering and pagination
- **👥 Owner Management** - View and manage property owners
- **📊 Dashboard** - Real-time metrics and property analytics
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🎨 Professional UI** - Custom design system with brand colors
- **⚡ Fast & Optimized** - Next.js build system with Fast Refresh
- **🧪 Type-Safe** - Full TypeScript coverage
- **♿ Accessible** - Radix UI components for accessibility

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework & routing |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 4.1.14 | Utility-first styling |
| **Zustand** | 5.0.8 | State management |
| **Axios** | 1.12.2 | HTTP client |
| **Radix UI** | Latest | Accessible components |
| **Lucide React** | 0.544.0 | Icon library |
| **React Hook Form** | 7.64.0 | Form handling |
| **Zod** | 4.1.11 | Schema validation |
| **date-fns** | 4.1.0 | Date utilities |
| **Jest** | 30.2.0 | Testing framework |
| **Next Themes** | 0.4.6 | Theme management |

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth route group
│   ├── (dashboard)/    # Protected dashboard routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # Reusable UI components
│   ├── guards/         # Route guards (ProtectedRoute, PublicRoute)
│   ├── layout/         # Layout components (Sidebar, Header, MainLayout)
│   └── ui/             # UI primitives (Button, Card, Input, Modal, etc.)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useToast.ts     # Toast notifications hook
├── lib/                # Utility libraries
│   └── utils.ts        # Helper functions
├── services/           # API services
│   └── api/           # API client and service modules
│       ├── apiClient.ts      # Axios instance with interceptors
│       ├── authService.ts    # Authentication service
│       ├── propertyService.ts # Property API calls
│       └── ownerService.ts   # Owner API calls
├── store/              # Zustand stores
│   ├── useAuthStore.ts # Authentication state
│   └── useUIStore.ts   # UI state (theme, sidebar, toasts)
├── types/              # TypeScript type definitions
│   └── index.ts        # All DTOs and interfaces
└── styles/             # Global styles
    └── globals.css     # Global CSS & Tailwind directives
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **.NET 9 Backend API** running (default: `https://localhost:5001`)

### Installation

1. **Clone the repository** (if not already done):
```bash
cd front
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update the API URL:
```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000
```

4. **Start the development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |

## 🔐 Authentication

The app uses **JWT-based authentication** with role-based access control.

### Login Flow

1. Navigate to `/login`
2. Enter any username and select a role:
   - **Admin** - Full CRUD access
   - **Editor** - Create, read, and update (no delete)
   - **Viewer** - Read-only access
3. The app stores the JWT token in `localStorage`
4. All API requests include the token in the `Authorization` header

### Protected Routes

Routes are protected using Next.js middleware and the `<ProtectedRoute>` component for client-side protection.

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary Blue** | `#003366` | Trust, professionalism, main actions |
| **Secondary Blue** | `#0099CC` | Innovation, secondary actions |
| **Accent Gold** | `#FFCC00` | Highlights, CTAs |
| **White** | `#FFFFFF` | Background |
| **Neutral Gray** | `#F5F5F5` | Cards, panels |
| **Text Gray** | `#333333` | Primary text |

### Typography

- **Font**: Inter (fallback: Roboto, system fonts)
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)

### Components

All UI components follow the design system and are located in `src/components/ui/`:

- **Button** - Primary, secondary, accent, outline, danger variants
- **Card** - Container with consistent padding and shadow
- **Input** - Form input with label and error handling
- **Select** - Dropdown with validation
- **Modal** - Accessible dialog using Radix UI
- **Badge** - Status indicators
- **Loading** - Spinner and skeleton loaders
- **Toast** - Notification system

## 🌐 API Integration

### Base Configuration

The API client is configured in `src/services/api/apiClient.ts`:

- Base URL from environment variable
- Automatic JWT token attachment
- Request/response interceptors
- Global error handling
- 401 auto-logout
- Rate limit handling

### Available Services

#### Authentication Service
```typescript
authService.login(credentials)
authService.logout()
authService.isAuthenticated()
authService.getCurrentUser()
```

#### Property Service
```typescript
propertyService.getProperties(filters)
propertyService.getPropertyById(id)
propertyService.createProperty(data)
propertyService.updateProperty(id, data)
propertyService.deleteProperty(id)
propertyService.uploadPropertyImage(id, file)
propertyService.getPropertyTraces(id)
```

#### Owner Service
```typescript
ownerService.getOwners(page, pageSize)
ownerService.getOwnerById(id)
ownerService.createOwner(data)
ownerService.updateOwner(id, data)
ownerService.deleteOwner(id)
```

## 🗺️ Routing

The app uses Next.js 15 App Router with the following structure:

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Protected |
| `/properties` | PropertyList | Protected |
| `/properties/:id` | PropertyDetails | Protected |
| `/properties/create` | PropertyForm | Admin, Editor |
| `/properties/:id/edit` | PropertyForm | Admin, Editor |
| `/owners` | OwnerList | Protected |
| `/owners/:id` | OwnerDetails | Protected |
| `/traces` | Traces | Protected |
| `/settings` | Settings | Protected |

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
```

Tests are written using **Jest** and **React Testing Library**.

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next/` folder.

### Start Production Server
```bash
npm run start
```

## 🐳 Docker Support

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t realestate-frontend .
docker run -p 3000:3000 realestate-frontend
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `https://localhost:5001/api/v1` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `30000` |

### Tailwind Configuration

Custom theme configuration in `tailwind.config.js`:
- Brand colors
- Custom fonts
- Responsive breakpoints
- Custom shadows

### ESLint & Prettier

Code quality is enforced with ESLint and Prettier:
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Code formatting
- `.editorconfig` - Editor consistency

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure the backend API allows your frontend origin
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

**2. Authentication Fails**
- Verify the backend `/api/v1/auth/token` endpoint is accessible
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

**3. Build Fails**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

**4. Port Already in Use**
- Change the port in `package.json` or run:
```bash
npm run dev -- -p 3001
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)
- [Zustand](https://docs.pmnd.rs/zustand)

## 🤝 Contributing

1. Follow the existing code style
2. Write TypeScript with strict mode
3. Add tests for new features
4. Run linter before committing: `npm run lint:fix`
5. Follow conventional commit messages

## 📄 License

This project is part of the Real Estate Management System.

---

**Built with ❤️ using Next.js 15 + React 19 + TypeScript + Tailwind CSS 4**
