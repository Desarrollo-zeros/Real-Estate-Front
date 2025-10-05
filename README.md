# Real Estate Management System - Frontend

A modern, production-ready Next.js application for managing real estate properties, built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. This frontend seamlessly integrates with the .NET 9 Clean Architecture backend.


# Login
<img width="1879" height="964" alt="image" src="https://github.com/user-attachments/assets/4df30f90-417d-4495-af2e-e5fbb54165b9" />

# Register
<img width="1876" height="948" alt="image" src="https://github.com/user-attachments/assets/39704959-eca9-4ba4-a64f-20cecc844b3a" />

# Dashboard
<img width="1870" height="959" alt="image" src="https://github.com/user-attachments/assets/26fa3ce0-67af-449c-93a0-8924764240e4" />

# Properties
<img width="1883" height="955" alt="image" src="https://github.com/user-attachments/assets/153a921b-3e61-47e0-a16f-1df7df896005" />
<img width="1882" height="1036" alt="image" src="https://github.com/user-attachments/assets/4e575936-4c64-464f-bbdf-9e6f02fb33d5" />
<img width="1882" height="958" alt="image" src="https://github.com/user-attachments/assets/2be807b0-c90b-4b58-ad6e-e36d93828d6f" />
<img width="1873" height="958" alt="image" src="https://github.com/user-attachments/assets/9bdc031b-2ce2-4d75-b9c6-d881bddaa03e" />
<img width="1871" height="963" alt="image" src="https://github.com/user-attachments/assets/8bfa6a68-cfc7-4b63-85f8-3efdc2c7f8c4" />

# Traces
<img width="1618" height="613" alt="image" src="https://github.com/user-attachments/assets/0c6474dc-3db4-4132-a90b-6afedd41663c" />
<img width="1628" height="901" alt="image" src="https://github.com/user-attachments/assets/21e8ff36-9f15-4d9c-bce5-d5dfdf99de36" />
<img width="1871" height="995" alt="image" src="https://github.com/user-attachments/assets/4c31d5a3-acb2-43e5-bac9-a95298fce204" />
<img width="1876" height="998" alt="image" src="https://github.com/user-attachments/assets/604d7cbe-d704-471e-a767-52c6de5db8e2" />
<img width="1866" height="958" alt="image" src="https://github.com/user-attachments/assets/fb602454-2a88-48fa-bbc2-de0d42830e5e" />
<img width="1862" height="956" alt="image" src="https://github.com/user-attachments/assets/7e1e4807-b23c-422f-8ec6-a1846164188b" />
<img width="1878" height="1005" alt="image" src="https://github.com/user-attachments/assets/154953a9-430b-43a3-af65-bd1d4a2fc101" />

#onwers
<img width="1878" height="954" alt="image" src="https://github.com/user-attachments/assets/2e84a17f-f6d0-423a-91e0-6db2e0e993d3" />
<img width="1863" height="951" alt="image" src="https://github.com/user-attachments/assets/7e36f326-18ac-46a8-ab0b-1ecb954bdb70" />
<img width="1878" height="955" alt="image" src="https://github.com/user-attachments/assets/29121b32-b61a-4045-8ac4-4cd2f3e81dde" />
<img width="1876" height="958" alt="image" src="https://github.com/user-attachments/assets/fd58602c-ee48-47a5-ad2d-12a90f2bca5a" />

# Settings
<img width="1870" height="961" alt="image" src="https://github.com/user-attachments/assets/b440f56a-8e8e-49a1-972b-753381c0fc1b" />
<img width="1872" height="996" alt="image" src="https://github.com/user-attachments/assets/94a57324-2e7c-40a6-a2cf-20482f6178bb" />
<img width="1874" height="961" alt="image" src="https://github.com/user-attachments/assets/6177e0a9-43b9-4fa7-a39f-9afcfc1a15e9" />
<img width="1867" height="961" alt="image" src="https://github.com/user-attachments/assets/a61f6739-ace6-48c9-a690-7f583bdb487b" />
<img width="1857" height="951" alt="image" src="https://github.com/user-attachments/assets/ca0558ae-d037-4516-9570-9a41060b3c01" />


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

- **Node.js** 18+ and npm/yarn/pnpm (for local development)
- **Docker Desktop** (for Docker setup)
- **.NET 9 Backend API** running (required)

---

### Option 1: Docker (Fastest) 🐳

**⚠️ Important:** Start the backend first!

```bash
# 1. Start backend (from /back directory)
cd back
docker-compose up -d

# 2. Start frontend (from /front directory)
cd ../front
docker-compose up -d --build
```

The app will be available at `http://localhost:3000`

📖 **See [DOCKER.md](DOCKER.md) for detailed Docker documentation**

---

### Option 2: Local Development

#### 1. **Clone the repository** (if not already done):
```bash
cd front
```

#### 2. **Install dependencies**:
```bash
npm install
```

#### 3. **Configure environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update the API URL:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000
```

#### 4. **Start the development server**:
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

### Prerequisites for Docker Build

**⚠️ IMPORTANTE:** Antes de construir la imagen Docker, debes configurar el archivo `.env.production`:

1. **Crear/Verificar `.env.production`** en la raíz del proyecto frontend:

```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Real Estate Management System
```

> **Nota:** Asegúrate de que `NEXT_PUBLIC_API_BASE_URL` apunte a la URL correcta de tu backend API.

### Option 1: Using Docker Compose (Recommended)

```bash
# Make sure backend is running first
cd ../back
docker-compose up -d

# Then start frontend
cd ../front
docker-compose up -d --build
```

📖 **See [DOCKER.md](DOCKER.md) for detailed instructions**

### Option 2: Manual Docker Build

If you prefer to build manually:

```bash
# Build the image
docker build -t realestate-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1 \
  realestate-frontend
```

### Docker Build Args

You can also pass the API URL during build:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://your-api-url/api/v1 \
  -t realestate-frontend .
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
