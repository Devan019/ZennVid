# Dashboard Architecture

This directory contains the modular dashboard application with a clean separation of concerns.

## Directory Structure

```
dashboard/
├── components/              # Shared dashboard components
│   ├── sidebar/            # Dashboard sidebar navigation
│   ├── DashboardBackground.tsx
│   ├── PageHeader.tsx
│   ├── FeatureRenderer.tsx
│   └── index.ts
│
├── features/               # Feature modules (tab features)
│   ├── magic-video/        # AI video generation
│   ├── sync-studio/        # Lip sync and facial motion
│   ├── anime-twin/         # Anime matching
│   ├── your-videos/        # Video gallery
│   └── index.ts
│
├── hooks/                  # Custom React hooks
│   └── useDashboardTabs.ts # Tab management logic
│
├── types/                  # TypeScript type definitions
│   └── index.ts
│
├── utils/                  # Utility functions
│   └── index.ts
│
├── layout.tsx              # Dashboard layout wrapper
└── page.tsx                # Main dashboard page
```

## Key Components

### `layout.tsx`
- Sets up the sidebar provider and theme
- Handles app-wide layout with query client wrapper
- Exports sidebar menu configuration

### `page.tsx`
- Main dashboard page
- Manages active tab state via URL hash
- Renders features dynamically based on active tab
- Handles video generation flow

### Features

Each feature is located in `features/[feature-name]/`:

- **magic-video**: AI video generation from prompts
- **sync-studio**: Lip sync and facial motion sync
- **anime-twin**: Anime character matching
- **your-videos**: Generated video gallery and management

### Components

Dashboard-specific components in `components/`:

- **DashboardSidebar**: Navigation sidebar with menu items
- **PageHeader**: Dynamic page header with title and description
- **DashboardBackground**: Background grid and gradient effects
- **FeatureRenderer**: Dynamic feature component renderer

### Hooks

- **useDashboardTabs**: Manages tab state, URL hash syncing, and page metadata

### Types

Centralized TypeScript definitions:
- `DashboardTab`: Union type of available tabs
- `PageMeta`: Page header metadata
- `FeatureGenerateProps`: Props for feature components
- `DashboardFeature`: Feature configuration interface

### Utils

Helper functions:
- `TAB_ORDER`: Ordered list of tabs
- `normalizeHash()`: Normalize URL hash
- `isDashboardTab()`: Type guard for dashboard tabs
- `getPageMeta()`: Get page metadata by tab

## Adding a New Feature

1. Create a folder in `features/[feature-name]/`
2. Create an `index.tsx` file that exports the feature component
3. Add the feature to the `DashboardTab` type in `types/index.ts`
4. Update `getPageMeta()` in `utils/index.ts` with metadata
5. Add a case in `FeatureRenderer.tsx` to render the feature
6. Update `TAB_ORDER` in `utils/index.ts`
7. Export the feature from `features/index.ts`

## Navigation

Tabs are managed via URL hash:
- `#magic-video`
- `#syncstudio`
- `#anime-matcher`
- `#your-videos`

Users can navigate by clicking sidebar items or programmatically via `useDashboardTabs` hook.
