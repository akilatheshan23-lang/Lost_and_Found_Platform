import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import foundRoutes from "./routes/found.routes.js";
import socialRoutes from "./routes/social.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// More forgiving CORS for local development.
// - Allows CLIENT_ORIGIN exactly.
// - Also allows localhost/127.0.0.1 on any port (Vite may switch 5173→5174, etc.).
const clientOrigin = process.env.CLIENT_ORIGIN;
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (clientOrigin && origin === clientOrigin) return cb(null, true);
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/found", foundRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;