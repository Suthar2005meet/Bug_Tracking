# Fix userId not saving to localStorage

## Steps:
- [x] 1. Add diagnostic console.logs to AuthProvider.jsx and Login.jsx
- [x] 2. Implement fallback for userId extraction (decoded._id || id || sub)
- [ ] 3. Test login and check console/localStorage
- [ ] 4. Verify persistence on page refresh
- [ ] 5. Fix backend JWT payload if no _id
- [ ] 6. Remove diagnostic logs once fixed

**Next**: Run `npm run dev`, login, check Browser Console (F12) & Application > Local Storage > userId value. Share console logs here.
