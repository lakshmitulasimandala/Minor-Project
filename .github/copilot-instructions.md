# Copilot Instructions for Reportify

## Project Overview
Reportify is a Next.js-based crime/incident reporting platform with anonymous user submission, AI-powered image analysis, and admin dashboard for review. The architecture separates public reporting flows from authenticated admin workflows.

## Architecture & Data Flow

### Core Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL (Neon serverless) via Prisma ORM
- **Auth**: NextAuth.js with JWT strategy and role-based access control (ADMIN, MODERATOR, USER)
- **UI**: React with Tailwind CSS and Shadcn components
- **AI Integration**: Google Generative AI (Gemini) for image analysis, OpenAI SDK available

### Key Data Models
Report entity has two lifecycles:
- **Status**: PENDING → IN_PROGRESS → RESOLVED/DISMISSED (admin workflow)
- **Type**: EMERGENCY vs NON_EMERGENCY (filters reports for severity)
- **ReportType**: 15+ categories (Theft, Fire, Medical Emergency, Pothole, etc.) - extracted via Gemini image analysis

### Request Flow
1. Public users submit reports with image via `POST /api/reports/create`
2. Image sent to `/api/analyze-image` → Gemini generates title, type, description
3. Report saved to PostgreSQL with location (latitude/longitude from Mapbox)
4. Admins/Moderators authenticate and access `/dashboard` to review in real-time

## Development Workflows

### Essential Commands
```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm run lint     # ESLint check
npm start        # Start production server
```

### Database Management
```bash
npx prisma migrate dev --name <migration_name>  # Create migration
npx prisma db push                              # Apply schema changes
npx prisma studio                               # GUI database browser
```

### Environment Setup
Create `.env.local` with:
```
DATABASE_URL=postgresql://...  # Neon serverless
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

## Project Conventions

### File Organization & Naming
- **API Routes**: `app/api/[domain]/[action]/route.ts` (e.g., `/api/reports/create`)
- **Pages**: `app/[section]/page.tsx` (e.g., `/dashboard/page.tsx`)
- **Components**: Modular in `components/` with feature subdirs (e.g., `components/report/`)
- **Types**: Centralized in `types/report.ts` with Zod validation schemas

### API Response Pattern
All endpoints return structured JSON responses with error handling:
```typescript
// Success
NextResponse.json({ data: object })
// Error
NextResponse.json({ error: "message" }, { status: CODE })
```

### Authentication Pattern
Protected routes use NextAuth middleware:
- Dashboard routes check for ADMIN/MODERATOR roles via middleware
- API routes call `getServerSession(authOptions)` to verify auth
- JWT callbacks in `lib/auth.ts` inject role into session token

### Component Patterns
- Use `"use client"` directive for interactive components (forms, state)
- Server components by default for data fetching
- React Hook Form + Zod for form validation
- Multi-step wizards track state in parent component (`ReportWizard.tsx` example)

### Database Query Patterns
- Use Prisma client from `lib/prisma.ts` singleton
- Implement timeout guards with `Promise.race()` for Neon serverless reliability
- Add database error codes handling (e.g., `P1001` for connection errors)
- Use `select` field to control response payload size

## Critical Integration Points

### Image Analysis
- Endpoint: `POST /api/analyze-image`
- Input: Base64 JPEG from file upload
- Output: Parsed title, reportType (enum), description from Gemini response
- Pattern: Structured prompt forces specific output format for reliable parsing

### Location Services
- Mapbox Search JS React for address autocomplete in forms
- Reverse geocoding at `POST /api/reverse-geocode` for coordinates → address
- Reports store both coordinates and string location

### File Upload Handling
- Client-side: React Dropzone + base64 encoding in `FileUploader.tsx`
- Server-side: Validate MIME type, handle base64 parsing in route handlers
- Error handling: Return 415 for unsupported types, 400 for invalid data

## Common Tasks & Patterns

### Adding New Report Type
1. Update `reportType` enum in `prisma/schema.prisma`
2. Update allowed types in Gemini prompt in `app/api/analyze-image/route.ts`
3. Add to UI select/filter dropdown in report form

### Creating Protected Admin Endpoint
1. Add route to `app/api/[domain]/route.ts`
2. Call `getServerSession(authOptions)` at start
3. Check `session.user.role` for ADMIN/MODERATOR
4. Return 401 if unauthorized

### Deploying with Neon
- Use `@neondatabase/serverless` adapter in Prisma config
- Enable connection pooling in Neon dashboard
- Set `DATABASE_URL` in production environment
- Prisma migrations auto-run on deploy (verify in build logs)

## Common Pitfalls

- **Image parsing**: Gemini output varies; regex patterns in `analyze-image/route.ts` may need adjustment
- **Session stale**: Clear browser cookies if auth state mismatches after code changes
- **Neon timeouts**: Set `15s` Promise.race timeout to catch serverless cold starts
- **Path aliases**: Always use `@/` prefix for imports; `@/*` maps to project root per tsconfig

## File Reference Guide
- **Auth config**: [lib/auth.ts](lib/auth.ts)
- **API patterns**: [app/api/reports/route.ts](app/api/reports/route.ts)
- **Form validation**: [types/report.ts](types/report.ts)
- **Schema**: [prisma/schema.prisma](prisma/schema.prisma)
- **Report submission flow**: [components/report/ReportWizard.tsx](components/report/ReportWizard.tsx)
- **Protected middleware**: [middleware.ts](middleware.ts)
