# Quick Start Guide

Get the Real Estate Management System frontend (Next.js 15 + React 19) up and running in **5 minutes**.

## Prerequisites

✅ **Node.js 18+** installed  
✅ **.NET 9 Backend** running at `https://localhost:5001`  
✅ **Terminal** or command prompt

## Step 1: Install Dependencies

```bash
cd front
npm install
```

This installs all required packages (~2 minutes).

## Step 2: Configure Environment

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

The default configuration should work if your backend is running on `https://localhost:5001`.

**`.env.local` contents:**
```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Step 3: Start Development Server

```bash
npm run dev
```

The app will start on **http://localhost:3000**

## Step 4: Login

1. Open your browser to `http://localhost:3000`
2. You'll see the login page
3. Enter any username (e.g., `admin`)
4. Select a role:
   - **Admin** - Full access (recommended for testing)
   - **Editor** - Can create/update (no delete)
   - **Viewer** - Read-only
5. Click **Sign In**

## Step 5: Explore

After login, you'll land on the **Dashboard** showing:
- Total properties
- Total value
- Average price
- Recent properties

### Navigation

Use the sidebar to navigate:

- **Dashboard** - Overview and metrics
- **Properties** - Browse, create, edit properties
- **Owners** - View property owners
- **Traces** - Sale history
- **Settings** - User preferences

### Quick Actions

**Add a Property:**
1. Click **Properties** in sidebar
2. Click **Add Property** button
3. Fill in the form
4. Click **Create Property**

**View Property Details:**
1. Go to **Properties**
2. Click on any property card
3. View full details, owner info, and sale history

**Edit a Property:**
1. Open property details
2. Click **Edit** button (Admin/Editor only)
3. Update fields
4. Click **Update Property**

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Troubleshooting

### "CORS Error" in Console
**Solution**: Ensure your backend API allows requests from `http://localhost:3000`

In your backend, check CORS configuration:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### "Network Error" / Cannot Connect
**Solution**: 
1. Verify backend is running: `https://localhost:5001/swagger`
2. Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Try: `curl https://localhost:5001/api/v1/properties`

### Port 3000 Already in Use
**Solution**: Run on a different port:
```bash
npm run dev -- -p 3001
```

### "Module not found" Error
**Solution**: Delete and reinstall:
```bash
rm -rf node_modules
npm install
```

## Next Steps

### 1. Explore the Code
- Check `src/pages/` for page components
- Review `src/components/ui/` for reusable components
- Look at `src/services/api/` for API integration

### 2. Customize
- Update colors in `tailwind.config.js`
- Modify `src/utils/constants.ts` for app settings
- Add your logo in `src/assets/`

### 3. Build for Production
```bash
npm run build
npm run start
```

### 4. Deploy
The `.next/` folder contains the production build. Deploy to:
- **Vercel**: `vercel deploy` (recommended for Next.js)
- **Netlify**: Connect your Git repository
- **Docker**: Use provided Dockerfile in README
- **Self-hosted**: Run `npm start` on your server

## Development Tips

### Fast Refresh
Next.js Fast Refresh auto-reloads components in the browser. No manual refresh needed!

### TypeScript Checks
VSCode will show TypeScript errors in real-time. Fix them before committing.

### Code Formatting
Run before committing:
```bash
npm run format
npm run lint:fix
```

### Browser DevTools
- **React DevTools**: Inspect component tree
- **Network Tab**: Debug API calls
- **Console**: Check for errors

## Sample Data

To test the app, create sample properties:

**Property 1:**
- Name: Modern Downtown Apartment
- Address: 123 Main Street, New York, NY
- Price: 500000
- Internal Code: PROP-001
- Year: 2020

**Property 2:**
- Name: Suburban Family Home
- Address: 456 Oak Avenue, Los Angeles, CA
- Price: 750000
- Internal Code: PROP-002
- Year: 2018

## API Endpoints Reference

All endpoints are relative to `VITE_API_BASE_URL`:

```
POST   /auth/token                  # Login
GET    /properties                  # List properties
POST   /properties                  # Create property
GET    /properties/{id}             # Get property
PUT    /properties/{id}             # Update property
DELETE /properties/{id}             # Delete property
POST   /properties/{id}/images      # Upload image
GET    /properties/{id}/traces      # Get sale history
GET    /owners                      # List owners
GET    /owners/{id}                 # Get owner
```

## Support

Need help? Check these resources:

- **README.md** - Complete documentation
- **ARCHITECTURE.md** - Technical architecture
- **Backend Swagger** - `https://localhost:5001/swagger`

## Summary

✅ Install dependencies → `npm install`  
✅ Configure environment → `.env.local`  
✅ Start dev server → `npm run dev`  
✅ Login at `http://localhost:3000`  
✅ Start building!

**You're all set! 🎉**

Happy coding! 🚀
