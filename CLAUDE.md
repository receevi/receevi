# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Receevi is an open-source WhatsApp Business solution built with Next.js 14, Supabase, and the WhatsApp Cloud API. It acts as a webhook receiver for WhatsApp Cloud API, enabling businesses to manage messages, contacts, and broadcast campaigns through a web interface similar to WhatsApp Web.

## Common Commands

### Development
```bash
npm run dev              # Start development server on localhost:3000
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
```

### Supabase CLI
```bash
supabase login                            # Login to Supabase CLI
supabase link --project-ref <ref-id>      # Link to Supabase project
supabase db push                          # Push database migrations
supabase functions deploy                 # Deploy all edge functions
supabase functions deploy <function-name> # Deploy specific edge function
```

## Architecture

### Next.js App Router Structure

The project uses Next.js 14 with App Router:

- **`app/(authorized)/`** - Protected routes requiring authentication
  - **`(panel)/`** - Main application panel with sidebar layout
    - `chats/` - WhatsApp chat interface with message sending/receiving
    - `contacts/` - Contact management and bulk import
    - `bulk-send/` - Broadcast message campaigns
    - `users/` - User management (admin only)
  - `setup/` - Initial setup wizard
  - `post-login/` - Post-authentication redirect handler
  - `update-password/` - Password change page

- **`app/webhook/`** - WhatsApp Cloud API webhook endpoint (receives all WhatsApp events)
- **`app/api/sendMessage/`** - API route for sending WhatsApp messages

### Authentication & Authorization

- Uses Supabase Auth with cookie-based sessions
- Middleware (`middleware.ts`) protects routes using `@/utils/supabase/middleware`
- Two user roles:
  - **Admin**: Full access to all features including user management
  - **Agent**: Limited access (can view/send messages but cannot manage users)
- Role-based access enforced via:
  - Supabase RLS policies (database level)
  - JWT claims in user metadata
  - Custom `authorize()` function checks role permissions

### Database Layer - Repository Pattern

The codebase uses a **repository pattern** with factory methods for dependency injection:

```
lib/repositories/
  ├── contacts/
  │   ├── ContactRepository.ts (interface)
  │   ├── ContactRepositorySupabaseImpl.ts (implementation)
  │   ├── ContactBrowserFactory.ts (client-side factory)
  │   └── ContactServerFactory.ts (server-side factory)
  ├── broadcast/
  ├── contact-tag/
  ├── message-template/
  └── setup/
```

**Key points:**
- Use factories to instantiate repositories (they handle Supabase client creation)
- Browser factories for client components
- Server factories for server components and API routes
- All repositories use TypeScript interfaces for type safety

### Supabase Integration

Three types of Supabase clients are used throughout the app:

1. **Service Client** (`lib/supabase/service-client.ts`)
   - Uses `SUPABASE_SERVICE_ROLE` key (bypasses RLS)
   - Used in webhook endpoint and system operations
   - Has full database access

2. **Server Client** (`utils/supabase-server.ts`)
   - Uses `SUPABASE_ANON_KEY` with cookie-based auth
   - Used in Server Components and Server Actions
   - Respects RLS policies based on authenticated user

3. **Browser Client** (`utils/supabase-browser.ts`)
   - Used in Client Components
   - Cookie-based session management
   - Real-time subscriptions for live updates

### Webhook Flow

1. WhatsApp Cloud API sends events to `/webhook` endpoint
2. Signature verification using `FACEBOOK_APP_SECRET`
3. Webhook payload stored in `webhook` table for audit
4. Events processed:
   - **Messages**: Stored in `messages` table, contacts upserted
   - **Statuses**: Updates message delivery/read status
   - **Media**: Downloaded and stored in Supabase Storage
5. Triggers Supabase Edge Functions:
   - `update-unread-count` - Updates unread message counters
   - Broadcast tracking functions

### Message Sending

Messages are sent via:
1. Client calls `/api/sendMessage` API route
2. API route calls WhatsApp Cloud API with `WHATSAPP_ACCESS_TOKEN`
3. Message stored in database with `is_received: false`
4. Status updates received via webhook (sent/delivered/read/failed)

### Key Database Tables

- **contacts** - WhatsApp contacts with profile info, last message timestamp, unread count, and tags
- **messages** - All messages (sent/received) with WhatsApp message ID (`wam_id`), JSON payload, and status timestamps
- **webhook** - Raw webhook payloads for debugging
- **message_template** - WhatsApp approved message templates synced from API
- **contact_tag** - Tags for organizing contacts
- **broadcast** - Broadcast campaigns
- **broadcast_contact** - Many-to-many relationship between broadcasts and contacts
- **setup** - System configuration and setup status
- **profiles** - User profile information
- **user_roles** - User role assignments (admin/agent)

### Supabase Edge Functions

Located in `supabase/functions/`:
- **bulk-send** - Process bulk message campaigns
- **send-message-batch** - Send messages in batches
- **sync-message-templates** - Sync templates from WhatsApp API
- **update-unread-count** - Update unread message counters
- **setup** - Initial setup wizard backend
- **insert-bulk-contacts** - Bulk contact import

### Real-time Features

The app uses Supabase Realtime for live updates:
- Message list updates when new messages arrive
- Contact list updates when new messages received
- Broadcast status updates during campaign execution
- Unread count updates

Enable realtime on tables via migrations (see `20230411173729_enable_realtime.sql`).

### Path Aliases

Configured in `tsconfig.json`:
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/utils/*` → `./utils/*`
- `@/types/*` → `./types/*`

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# JWT secret for custom token signing
JWT_SECRET_KEY=<random-hex-32>

# WhatsApp webhook verification
WEBHOOK_VERIFY_TOKEN=<random-hex-32>

# Facebook/WhatsApp API credentials
FACEBOOK_APP_SECRET=<from-facebook-app-settings>
WHATSAPP_ACCESS_TOKEN=<permanent-token>
WHATSAPP_API_PHONE_NUMBER_ID=<from-whatsapp-api-setup>
WHATSAPP_BUSINESS_ACCOUNT_ID=<from-whatsapp-api-setup>

# Supabase credentials
SUPABASE_URL=<from-supabase-project-settings>
SUPABASE_ANON_KEY=<from-supabase-project-settings>
SUPABASE_SERVICE_ROLE=<from-supabase-project-settings>
```

**Important**: Never commit actual secrets. The `.env.example` should contain only placeholder values.

## Development Workflow

1. **Local development**:
   - Copy `.env.example` to `.env.local` and fill in values
   - Run `npm run dev`
   - Supabase can be local (with `supabase start`) or remote

2. **Database changes**:
   - Create migration files in `supabase/migrations/`
   - Use timestamp prefix: `YYYYMMDDHHMMSS_description.sql`
   - Push with `supabase db push`

3. **Edge function changes**:
   - Edit in `supabase/functions/<function-name>/`
   - Shared code in `supabase/functions/_shared/`
   - Deploy with `supabase functions deploy <function-name>`
   - Add secrets via Supabase dashboard (Project Settings > Edge Functions)
   - Required Edge Function secrets for broadcast features:
     - `WHATSAPP_ACCESS_TOKEN` - WhatsApp Cloud API permanent token
     - `WHATSAPP_BUSINESS_ACCOUNT_ID` - WhatsApp Business Account ID
     - `WHATSAPP_API_PHONE_NUMBER_ID` - Phone Number ID from WhatsApp API Setup

4. **Component development**:
   - UI components in `components/ui/` (shadcn/ui based)
   - Feature components co-located with pages in `app/` directory
   - Use Server Components by default, add `"use client"` only when needed
   - Client components needed for: React hooks, event handlers, browser APIs, Supabase realtime

## Key Technologies

- **Next.js 14**: App Router, Server Components, Server Actions
- **Supabase**: Database (PostgreSQL), Auth, Storage, Realtime, Edge Functions
- **TypeScript**: Strict mode enabled
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: UI component library (Radix UI + Tailwind)
- **React Hook Form + Zod**: Form validation
- **TanStack Query**: Data fetching and caching (used in some components)
- **dayjs**: Date/time manipulation

## Testing the Integration

1. Send test message to WhatsApp number
2. Check webhook logs: `app/webhook/route.ts` console output
3. Verify message appears in Supabase `messages` table
4. Check contact appears in UI at `/chats`
5. Reply from UI and verify delivery via WhatsApp status updates

## Important Notes

- The webhook endpoint (`/webhook`) must be publicly accessible for WhatsApp to send events
- WhatsApp requires HTTPS for webhooks (use Vercel deployment or ngrok for local testing)
- Message templates must be pre-approved by Facebook before they can be used in broadcasts
- Rate limits apply to WhatsApp Cloud API (check Facebook documentation)
- Supabase RLS policies enforce security at database level - always test with appropriate user roles
- Media files are stored in Supabase Storage buckets (`avatars` and `media`)

### RLS Policy Pattern (CRITICAL)

**Important**: Due to Supabase SSR limitations, custom JWT claims from auth hooks aren't always accessible in RLS policy context. All RLS policies use a **fallback pattern**:

```sql
-- Always use this pattern for role-based RLS policies:
USING (
    -- Try JWT claim first
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    -- Fallback to user_roles table lookup
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
)
```

This ensures policies work reliably even when `auth.jwt() ->> 'user_role'` returns NULL. See migration `20251111230921_fix-rls-policies-with-fallback.sql` for complete implementation.
