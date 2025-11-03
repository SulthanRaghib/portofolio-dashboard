# Portfolio Dashboard

A modern, full-featured portfolio management dashboard built with Next.js 16, React 19, and TypeScript. This application provides a comprehensive interface for managing portfolio projects with authentication, search functionality, and image uploads.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Integration](#api-integration)
- [Features Documentation](#features-documentation)
- [Development](#development)
- [Build & Deploy](#build--deploy)

## 🎯 Overview

Portfolio Dashboard is a content management system designed for developers and designers to manage their portfolio projects efficiently. It features a clean, responsive interface with dark/light theme support, real-time search, and seamless API integration.

**Live API Backend:** https://portofolio-backend-beta.vercel.app

## ✨ Features

### Core Functionality

- **Authentication System** - JWT-based login with persistent sessions
- **Project Management** - Full CRUD operations for portfolio projects
- **Image Upload** - File upload with preview and FormData handling
- **Search & Filter** - Real-time search across projects with backend integration
- **Dashboard Statistics** - Live project metrics and analytics
- **Theme Toggle** - Dark/Light mode with system preference detection
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### User Experience

- Toast notifications for user feedback
- Form validation with backend error handling
- Loading states and error boundaries
- Optimistic UI updates
- Keyboard navigation support

## 🛠 Technology Stack

### Frontend Framework

- **Next.js 16.0.0** - React framework with App Router and Turbopack
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI & Styling

- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon system
- **class-variance-authority** - Component variant management

### State Management

- **Zustand 5.0.8** - Lightweight state management
  - `useAuth` - Authentication state
  - `useTheme` - Theme preferences
  - `useSearch` - Search query state

### Form Handling

- **React Hook Form 7.60.0** - Performant form management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Additional Libraries

- **date-fns 4.1.0** - Date manipulation
- **next-themes** - Theme management
- **sonner** - Toast notifications

## 📁 Project Structure

```
portfolio-dashboard/
├── app/                        # Next.js App Router
│   ├── actions/                # Server actions
│   │   └── auth.ts             # Authentication actions
│   ├── dashboard/              # Protected dashboard routes
│   │   ├── layout.tsx          # Dashboard layout with auth guard
│   │   ├── page.tsx            # Dashboard home with statistics
│   │   ├── projects/           # Projects management
│   │   │   └── page.tsx        # Projects list and CRUD
│   │   └── settings/           # User settings
│   │       └── page.tsx        # Settings page
│   ├── login/                   # Authentication
│   │   └── page.tsx            # Login page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                 # React components
│   ├── ui/                     # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (other UI components)
│   ├── navbar.tsx              # Top navigation with search
│   ├── sidebar.tsx             # Side navigation
│   ├── theme-toggle.tsx        # Dark/Light mode toggle
│   ├── project-form.tsx        # Create/Edit project form
│   └── project-table.tsx       # Projects data table
├── lib/                        # Utility libraries
│   ├── api.ts                  # API client functions
│   ├── auth.ts                 # Authentication utilities
│   ├── config.ts               # Centralized configuration
│   └── utils.ts                # Helper functions
├── store/                      # Zustand state stores
│   ├── useAuth.ts              # Auth state management
│   ├── useTheme.ts             # Theme state management
│   └── useSearch.ts            # Search state management
├── hooks/                      # Custom React hooks
│   └── use-toast.tsx           # Toast notification hook
├── public/                     # Static assets
├── components.json             # Shadcn UI configuration
├── next.config.ts              # Next.js configuration
├── proxy.ts                    # Proxy configuration for API
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── eslint.config.mjs           # ESLint configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- Git for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

   Note: Some packages require legacy peer deps flag:

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

## ⚙️ Configuration

### Environment Setup

1. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure API URL**

   Edit `.env.local` and set your backend API URL:

   ```env
   NEXT_PUBLIC_API_URL=https://your-api-backend-url.com
   ```

   If not set, it defaults to: `https://portofolio-backend-beta.vercel.app`

### Theme Configuration

Customize theme colors in `app/globals.css` using OKLCH color space:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.37 0.2 265);
  /* ... other color variables */
}
```

## 🔌 API Integration

### Authentication

**Login Endpoint**

```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: object }
```

**Token Storage**

- JWT tokens stored in `localStorage` with key `jwt_token`
- Automatic token inclusion in API requests via Authorization header

### Projects API

**Get Projects**

```typescript
GET /api/projects?search=query&page=1&limit=10&featured=true&sortBy=createdAt&sortOrder=desc
```

**Create Project**

```typescript
POST /api/projects
Content-Type: multipart/form-data
Body: FormData with project fields + image file
```

**Update Project**

```typescript
PUT /api/projects/:id
Content-Type: multipart/form-data
Body: FormData with updated fields
```

**Delete Project**

```typescript
DELETE /api/projects/:id
```

### API Response Structure

```typescript
{
  success: boolean;
  data: Array<Project>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  links?: {
    self: string;
    next?: string;
    prev?: string;
  };
}
```

## 📖 Features Documentation

### Authentication Flow

1. User enters credentials on `/login` page
2. API validates and returns JWT token
3. Token stored in localStorage
4. Dashboard layout checks token validity
5. Unauthorized users redirected to login
6. Logout clears token and redirects

### Project Management

**Creating Projects**

- Fill out the project form with required fields
- Upload project image (optional)
- Image preview shown before submission
- Backend validation for all fields
- Success toast on creation

**Editing Projects**

- Click edit button in projects table
- Form pre-fills with existing data
- Change fields or upload new image
- Submit to update project

**Deleting Projects**

- Click delete button with confirmation dialog
- Soft delete or permanent removal (backend dependent)

### Search Functionality

**How it works:**

1. Type query in navbar search bar
2. Press Enter or click search button
3. Query stored in Zustand `useSearch` store
4. Navigates to `/dashboard/projects`
5. Projects page fetches filtered results
6. Results display with "Found X projects matching 'query'" message
7. Click X button to clear search

**Search Parameters:**

- `search` - Text query for project title/description
- `featured` - Filter featured projects
- `sortBy` - Sort field (createdAt, title, etc.)
- `sortOrder` - asc or desc

### Image Upload

**Implementation:**

- File input with accept="image/\*"
- FileReader API for client-side preview
- FormData for multipart/form-data submission
- Remove image button clears selection
- Backend handles file storage and URL generation

**Code Example:**

```typescript
const formData = new FormData();
formData.append("title", data.title);
formData.append("image", imageFile);
// Other fields...
await api.createProject(token, formData);
```

### Theme System

**Features:**

- System preference detection
- Manual toggle between light/dark
- Persistent theme selection
- CSS variable-based theming
- Smooth transitions

## 💻 Development

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Configured with Next.js rules
- **Components** - Functional components with hooks
- **Naming** - PascalCase for components, camelCase for functions
- **File Structure** - Feature-based organization

### State Management Patterns

**Zustand Store Example:**

```typescript
import { create } from "zustand";

export const useSearch = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  clearQuery: () => set({ query: "" }),
}));
```

### API Client Pattern

All API calls centralized in `lib/api.ts` with consistent error handling and token management.

### Form Validation

- Client-side validation with React Hook Form + Zod
- Backend validation errors parsed and displayed
- No HTML5 required attributes (backend validation preferred)

## 🏗 Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Deployment Options

**Recommended Platforms:**

- **Vercel** - Zero configuration deployment
- **Netlify** - Automatic CI/CD
- **Railway** - Full-stack hosting
- **Custom Server** - Node.js environment

### Build Output

- Static pages pre-rendered at build time
- Dynamic routes rendered on-demand
- Optimized JavaScript bundles
- Automatic code splitting

### Environment Variables

The project uses environment variables for sensitive configuration:

**`.env.local` (Local Development)**

```env
NEXT_PUBLIC_API_URL=https://portofolio-backend-beta.vercel.app
```

**`.env.example` (Template)**

```env
NEXT_PUBLIC_API_URL=https://your-api-backend-url.com
```

**Production Deployment:**

- Set environment variables in your hosting platform dashboard
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway: Project → Variables

**Available Environment Variables:**

| Variable                | Description                    | Default                                      | Required |
| ----------------------- | ------------------------------ | -------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`   | Backend API base URL           | `https://portofolio-backend-beta.vercel.app` | No       |
| `NEXT_PUBLIC_TOKEN_KEY` | LocalStorage key for JWT token | `jwt_token`                                  | No       |
| `NEXT_PUBLIC_THEME_KEY` | LocalStorage key for theme     | `theme`                                      | No       |

**Security Note:**

- Never commit `.env.local` to version control
- `.gitignore` already excludes `.env*` files
- Use `.env.example` as a template for team members
- All configuration is centralized in `lib/config.ts`

## 🔒 Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for enhanced security)
- No sensitive data in client-side code
- API authentication required for all protected routes
- Input sanitization on backend
- CORS configured on API server

## 📝 Notes

- This is a proprietary project (not open source)
- Built for portfolio management and demonstration purposes
- Uses legacy peer deps for React 19 compatibility with Radix UI
- Turbopack enabled for faster development builds

## 🤝 Support

For issues, questions, or feature requests, please contact the development team.

---

**Version:** 0.1.0  
**Last Updated:** November 2025  
**Node Version:** 18.x or higher  
**Framework:** Next.js 16.0.0
