# Charts Not Showing Fix Plan

## Current Status
Charts work for ProjectManager role but fail for Tester/Developer. Unified Dashboard.jsx expects role-specific data from /dashboard/all API.

## Steps
- [x] Understand files (Dashboard.jsx, charts)
- [ ] Step 1: Add mock data and console.log to src/pages/Dashboard.jsx for all roles
- [ ] Step 2: Edit Dashboard.jsx to use real data if available, mock if empty
- [ ] Step 3: Run `npm run dev`, login as Tester/Developer, verify charts show mock data, check console for API response
- [ ] Step 4: Check Network tab for /dashboard/all data structure
- [ ] Step 5: Fix backend to return complete role-specific charts data
- [ ] Step 6: Remove mocks after backend fix
- [ ] Step 7: Test all roles (Admin, PM, Dev, Tester)
- [ ] Step 8: attempt_completion

Next: Step 1-2
