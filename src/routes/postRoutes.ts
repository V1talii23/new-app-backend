import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  createPost,
  deletePost,
  getUserPosts,
  updatePost,
  getAllPosts,
} from "../controllers/postsControllers.js";
import validate from "../middleware/validateInput.js";
import {
  postCreateSchema,
  postIdSchema,
  postSearchSchema,
  postUpdateSchema,
} from "../validations/postValidation.js";

const router = Router();

router.get("/", validate(postSearchSchema,"params"), getAllPosts);

router.use(authenticate);

router.get("/my", getUserPosts);

router.post("/", validate(postCreateSchema), createPost);

router.patch(
  "/:postId",
  validate(postIdSchema, "params"),
  validate(postUpdateSchema),
  updatePost,
);

router.delete("/:postId", deletePost);

export default router;
