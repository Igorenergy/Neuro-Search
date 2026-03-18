# Neuro-Search

AI-powered deep research platform. Allows users to create research projects, automatically collect and analyze web sources, generate artifacts (reports, comparisons), and manage a data repository.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS v4, shadcn/ui, Radix UI
- **State / Data Fetching**: TanStack React Query
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (via drizzle-zod)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env   # then fill in DATABASE_URL

# Push database schema
npm run db:push

# Run dev server
npm run dev             # http://localhost:3000
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type-check |
| `npm run db:push` | Push Drizzle schema to database |

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── api/                    # API Route Handlers (REST)
│   │   ├── projects/           # CRUD for research projects
│   │   │   └── [id]/
│   │   │       ├── sources/    # GET/POST project sources
│   │   │       ├── artifacts/  # GET/POST project artifacts
│   │   │       ├── files/      # GET/POST project files
│   │   │       └── plans/      # GET/POST research plans
│   │   ├── sources/[id]/       # PATCH/DELETE individual source
│   │   ├── artifacts/[id]/     # PATCH/DELETE individual artifact
│   │   ├── files/[id]/         # DELETE individual file
│   │   └── seed/               # Seed endpoint
│   ├── research/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── search/             # Project search
│   │   └── launcher/           # New research wizard
│   ├── sources/[id]/           # Sources & Artifacts viewer
│   ├── research-in-progress/   # Live research progress
│   ├── research-failed/        # Error handling / action required
│   ├── research-canceled/      # Canceled research
│   ├── files-attachments/      # Data repository
│   └── smart-search/new/       # Smart search launcher
│
├── components/
│   ├── pages/                  # Page-level components
│   │   ├── dashboard.tsx       # Project grid, filters, archived
│   │   ├── sources.tsx         # Sources + Artifacts tabs
│   │   ├── search.tsx          # Global search
│   │   ├── launcher.tsx        # Research creation wizard
│   │   ├── search-in-progress.tsx  # AI thought stream
│   │   ├── smart-search-failed.tsx # Error scenarios
│   │   ├── action-required.tsx     # Partial report review
│   │   └── assets-repository.tsx   # File/folder manager
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout.tsx              # App shell (sidebar, header)
│   ├── create-project-modal.tsx    # Multi-step project creation
│   ├── source-details-drawer.tsx   # Source preview side panel
│   ├── export-project-modal.tsx
│   ├── share-project-modal.tsx
│   └── ...
│
├── hooks/                      # React Query data hooks
│   ├── use-projects.ts         # Dashboard + sidebar projects
│   ├── use-search-projects.ts  # Search results
│   ├── use-project-sources.ts  # Sources CRUD + optimistic updates
│   ├── use-project-artifacts.ts # Artifacts CRUD + optimistic updates
│   ├── use-research-progress.ts # AI thought stream (polling)
│   ├── use-research-errors.ts  # Failed sources + error log
│   ├── use-action-required.ts  # Partial report data
│   ├── use-data-repository.ts  # Folders, files, storage stats
│   ├── use-current-user.ts     # Auth / user profile
│   └── use-source-details.ts   # Source preview + raw files
│
├── lib/
│   ├── types.ts                # All shared TypeScript interfaces
│   ├── db.ts                   # Drizzle + pg connection
│   ├── storage.ts              # Data access layer (IStorage)
│   ├── queryClient.ts          # React Query client + apiRequest
│   ├── launch-config.ts        # Session-based launch state
│   └── utils.ts                # cn() helper
│
├── shared/
│   └── schema.ts               # Drizzle ORM table definitions + Zod schemas
│
└── public/                     # Static assets
```

## Database Schema

Six tables managed by Drizzle ORM:

| Table | Purpose |
|-------|---------|
| `users` | User accounts (id, username, password) |
| `research_projects` | Research projects (query, type, engine, languages, status, ...) |
| `research_plans` | Versioned research plans (steps JSON, version) |
| `research_files` | Uploaded files attached to projects |
| `project_sources` | Web sources per project (title, domain, url, confidence_score, included, language, location) |
| `project_artifacts` | Generated artifacts per project (name, file_type, file_size, status, download_url) |

Push schema changes:
```bash
npm run db:push
```

## API Routes

All endpoints return JSON. Standard REST conventions.

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project by ID |
| PATCH | `/api/projects/:id` | Update project |

### Sources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/sources` | List sources for project |
| POST | `/api/projects/:id/sources` | Add source to project |
| PATCH | `/api/sources/:id` | Update source (include/exclude, etc.) |
| DELETE | `/api/sources/:id` | Remove source |

### Artifacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/artifacts` | List artifacts for project |
| POST | `/api/projects/:id/artifacts` | Create artifact |
| PATCH | `/api/artifacts/:id` | Update artifact |
| DELETE | `/api/artifacts/:id` | Remove artifact |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/projects/:id/plans` | Research plans |
| GET/POST | `/api/projects/:id/files` | Attached files |
| DELETE | `/api/files/:id` | Remove file |

## Frontend Architecture — Backend Integration Guide

### How data flows

```
Component → React Query Hook → fetch(/api/...) → Next.js Route Handler → Storage → PostgreSQL
```

Every page component consumes data through a dedicated React Query hook. Hooks currently include **mock data as fallback** — when the API returns empty or fails, mock data is used so the UI always renders.

### Hook → API mapping

| Hook | API Endpoint | Fallback |
|------|-------------|----------|
| `useProjects()` | `GET /api/projects` | 20 mock projects |
| `useArchivedProjects()` | `GET /api/projects?archived=true` | 20 mock archived |
| `useSidebarProjects()` | Derived from `useProjects()` | — |
| `useSearchProjects(q)` | `GET /api/projects/search?q=` | 16 mock results |
| `useProjectSources(id)` | `GET /api/projects/:id/sources` | 12 mock sources |
| `useProjectArtifacts(id)` | `GET /api/projects/:id/artifacts` | 2 mock artifacts |
| `useResearchProgress(id)` | `GET /api/projects/:id/progress` | Mock thought stream |
| `useResearchErrors(id)` | `GET /api/projects/:id/errors` | Mock error data |
| `useActionRequired(id)` | `GET /api/projects/:id/action-required` | Mock partial report |
| `useDataRepository()` | `GET /api/data-repository` | Mock folders/files |
| `useCurrentUser()` | `GET /api/user/me` | Mock user profile |
| `useSourceDetails(id)` | `GET /api/sources/:id/details` | Mock preview content |

### How to integrate a real backend endpoint

1. Implement the API route (or point to external service)
2. Open the corresponding hook in `hooks/`
3. The `queryFn` already calls `fetch(...)` — just make sure the response matches the TypeScript interface in `lib/types.ts`
4. Remove or keep mock fallback as needed
5. Component code stays **unchanged**

### Mutations with optimistic updates

`useToggleSourceInclusion` and `useDeleteArtifact` implement optimistic updates:
- UI updates immediately on user action
- Background API call syncs with server
- On error, previous state is restored automatically

### Shared types

All data interfaces live in `lib/types.ts`. Key types:

- `ProjectListItem` — dashboard project card
- `SourceRow` — source entry (title, domain, confidence, included/excluded)
- `ArtifactRow` — generated file (name, type, size, status, download URL)
- `ThoughtNode` — AI thinking step or source list
- `FailedSourceItem` — source with error info
- `CurrentUser` — user profile + balance
- `DataRepositoryData` — folders, files, storage stats

## Data Access Layer

`lib/storage.ts` exports a `DatabaseStorage` class implementing the `IStorage` interface. All database operations go through this layer:

```typescript
interface IStorage {
  // Users
  getUser(id): Promise<User>
  createUser(user): Promise<User>

  // Projects
  getResearchProjects(): Promise<ResearchProject[]>
  createResearchProject(project): Promise<ResearchProject>
  updateResearchProject(id, data): Promise<ResearchProject>

  // Sources
  getProjectSources(projectId): Promise<ProjectSource[]>
  createProjectSource(source): Promise<ProjectSource>
  updateProjectSource(id, data): Promise<ProjectSource>
  deleteProjectSource(id): Promise<void>

  // Artifacts
  getProjectArtifacts(projectId): Promise<ProjectArtifact[]>
  createProjectArtifact(artifact): Promise<ProjectArtifact>
  updateProjectArtifact(id, data): Promise<ProjectArtifact>
  deleteProjectArtifact(id): Promise<void>

  // Plans & Files
  getResearchPlans(projectId): Promise<ResearchPlan[]>
  createResearchPlan(plan): Promise<ResearchPlan>
  getResearchFiles(projectId): Promise<ResearchFile[]>
  createResearchFile(file): Promise<ResearchFile>
  deleteResearchFile(id): Promise<void>
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
