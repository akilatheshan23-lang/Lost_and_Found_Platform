# Lost & Found UML - Fixed MERN Setup

## Main fixes in this ZIP
- frontend and backend now use the same default port flow
- frontend API config now reads `VITE_API_URL` correctly
- Vite proxy added for `/Users`, `/api`, `/uploads`, and `/health`
- backend no longer crashes if MongoDB is unavailable at startup
- `/health` now shows whether the server is running and whether MongoDB is connected
- `bcrypt` replaced with `bcryptjs` to avoid Windows/native build issues
- removed `.git`, `node_modules`, build output, and real `.env` files

## Setup
1. Extract the ZIP
2. Create `backend/.env` from `backend/.env.example`
3. Put your real MongoDB Atlas URI into `backend/.env`
4. Run:

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

## Test URLs
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/health`

## Important note
If `/health` opens but `dbReady` is `false`, the backend is running and the remaining issue is your MongoDB connection string or Atlas network access.
