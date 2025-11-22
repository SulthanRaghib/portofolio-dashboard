# Portfolio Dashboard - Certifications Feature Update

## Summary

Successfully added a comprehensive certifications management feature to the Portfolio Dashboard, integrating with the existing portfolio backend API.

## Changes Made

### 1. API Configuration (`lib/config.ts`)

- Added `CERTIFICATIONS: "/api/certifications"` endpoint to `API_CONFIG.ENDPOINTS`

### 2. API Methods (`lib/api.ts`)

Added four new API methods for certifications management:

- `getCertifications(token, params?)` - Fetch certifications with pagination and search
- `createCertification(data, token)` - Create new certification
- `updateCertification(id, data, token)` - Update existing certification
- `deleteCertification(id, token)` - Delete certification

### 3. Certifications Page (`app/dashboard/certifications/page.tsx`)

- Complete CRUD interface for managing certifications
- Search integration using existing `useSearch` store
- Toast notifications for user feedback
- Loading states and error handling

### 4. Certification Form Component (`components/certification-form.tsx`)

Full-featured form dialog with:

- **Required fields**: Title, Issuer, Issued Date, Certificate Image
- **Optional fields**: Expiration Date, Credential URL, Credential ID
- **Skills management**: Add/remove multiple skills with tags
- **Image upload**: Preview and replace functionality
- **Validation**: Client-side validation for required fields
- **Form modes**: Create new or edit existing certifications

### 5. Certification Table Component (`components/certification-table.tsx`)

Data table displaying:

- Certificate thumbnail image
- Title with credential ID
- Issuer information
- Issue and expiration dates
- Skills tags (showing first 2 with +X more indicator)
- Action buttons: View credential URL, Edit, Delete
- Delete confirmation dialog

### 6. Sidebar Navigation (`components/sidebar.tsx`)

- Already included Certifications link with Trophy icon
- Located at `/dashboard/certifications`

### 7. Dashboard Stats (`app/dashboard/page.tsx`)

Enhanced dashboard overview with:

- Total Projects count
- Featured Projects count
- **NEW**: Total Certifications count
- Last Updated date
- Responsive grid layout (2 cols on medium, 4 cols on large screens)

## Backend Integration

The implementation connects to the portfolio backend endpoints:

- **GET** `/api/certifications` - List certifications (with pagination, search, sorting)
- **GET** `/api/certifications/:id` - Get single certification
- **POST** `/api/certifications` - Create certification (requires auth)
- **PUT** `/api/certifications/:id` - Update certification (requires auth)
- **DELETE** `/api/certifications/:id` - Delete certification (requires auth)

## Features Included

✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Image upload with preview
✅ Search functionality
✅ Pagination support
✅ Skills/tags management
✅ Credential URL linking
✅ Expiration date tracking
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Toast notifications
✅ Delete confirmations
✅ JWT authentication integration

## Data Model

```typescript
interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expirationAt?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  skills: string[];
  image: string;
  createdAt: string;
}
```

## Usage

1. Navigate to **Dashboard → Certifications** in the sidebar
2. Click **Add Certification** to create a new certificate
3. Fill in required information and upload certificate image
4. Add relevant skills using the skills input
5. Edit or delete certifications using action buttons
6. View certificate credentials using the external link icon

## Technical Notes

- Uses FormData for file uploads (handles multipart/form-data)
- Integrates with existing authentication system (JWT tokens)
- Follows the same patterns as the Projects feature
- Uses shadcn/ui components for consistency
- TypeScript typed throughout
- Responsive and accessible UI

## Files Created/Modified

**Created:**

- `app/dashboard/certifications/page.tsx`
- `components/certification-form.tsx`
- `components/certification-table.tsx`

**Modified:**

- `lib/config.ts`
- `lib/api.ts`
- `app/dashboard/page.tsx`

---

Backend Repository: https://github.com/sulthanraghib/portofolio-backend
