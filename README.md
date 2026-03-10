# TeamBoard

A simplified Jira/Trello-style workflow board built with **Next.js 14**, **TypeScript**, **Tailwind CSS v3**, and **Redux Toolkit**.

## Getting Started

```bash
npx create-next-app@latest team-board

cd team-board

npm install @reduxjs/toolkit react-redux uuid lucide-react

npm install -D @types/uuid

npm install

npm run dev

npm run build

```

Open [http://localhost:3000](http://localhost:3000).

Environment Setup
```bash
cp .env.example .env


Edit .env and set:
```
## Bug Fixes (search & sort)

**Search** Fixed search issue by syncing FilterBar search input directly with Redux.

**Sort** Fixed sorting issue caused by stale values from a separate hook.

**Priority filter clear** Fixed priority filter reset by using a single clearFilters Redux action.

## Storage & Migrations

- `localStorage` key: `local_teamboard_tasks` (JSON array of tasks)
- Storage version key: `local_teamboard_schema_version`
- Current version: **2**
- Migration v1→v2: ensures `tags` is always an array and `updatedAt` is always set.
- On first load with no stored data, Json_Data are saved automatically.

## Key Decisions

| Decision | Rationale |
|---|---|
| Redux Toolkit | Single source of truth for tasks + filters; `createSelector` for efficient derived data |
| No redux-persist | Simple `useEffect` save on task change is more predictable; no serialization issues |
| `createSelector` for filters | Prevents re-renders when unrelated state changes; memoizes expensive filter+sort pass |
| Tailwind v3 | v4 has breaking changes; v3 is stable with the existing postcss pipeline |
| No DnD library | Native HTML5 drag-and-drop is sufficient for 3-column boards |
