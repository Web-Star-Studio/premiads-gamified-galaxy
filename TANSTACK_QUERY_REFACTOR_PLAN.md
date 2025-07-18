# Refactor Plan: Implementing TanStack Query

This plan outlines the steps to refactor the existing data-fetching logic to use **TanStack Query**, improving performance, simplifying state management, and enhancing user experience.

## 1. Configure TanStack Query

- **Create a Query Client**:
  - Create a new file at `src/lib/query-client.ts` to instantiate and export a single `QueryClient` instance.
  - Configure the client with default options for caching, refetching, and stale time to ensure consistent behavior across the application.

- **Provide the Query Client**:
  - In `src/providers/AppProviders.tsx`, wrap the main application component with the `QueryClientProvider` and pass the created `QueryClient` instance.

## 2. Refactor Data Fetching

- **Identify Data-Fetching Hooks**:
  - Analyze custom hooks in `src/hooks` that manage server state, such as `useAdvertiserCampaigns`, `useUserProfile`, and `useMissions`, and refactor them to use `useQuery`.

- **Replace Direct API Calls**:
  - Search for and replace direct `fetch`, `axios`, and `supabase.from` calls in components and services with `useQuery` for data fetching and `useMutation` for data modification.

- **Implement Mutations**:
  - Refactor all data creation, update, and deletion logic to use `useMutation` for handling loading, error, and success states, as well as for cache invalidation.

## 3. Manage Server State

- **Consolidate State Management**:
  - Replace `useState` and `useEffect` combinations used for managing server state with TanStack Query's cache.
  - Refactor `zustand` stores that handle server state to use TanStack Query, centralizing server state management and reducing complexity.

- **Implement Optimistic Updates**:
  - For critical mutations, such as mission submissions and profile updates, implement optimistic updates to improve perceived performance and user experience.

## 4. Ensure Application Stability

- **Update Tests**:
  - Modify existing tests to accommodate the new data-fetching logic, mocking TanStack Query hooks and API calls as needed.
  - Add new tests to cover the refactored code and ensure its correctness.

- **Verify Functionality**:
  - Manually test all refactored parts of the application to ensure they work as expected and that there are no regressions.
