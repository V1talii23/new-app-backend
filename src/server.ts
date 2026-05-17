import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notFoundHandler from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";
import { logger } from "./middleware/logger.js";

const PORT = 3000;

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
