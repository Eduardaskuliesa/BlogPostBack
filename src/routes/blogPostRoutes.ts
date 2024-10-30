import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
} from "../controllers/blogPostController";

const router = Router();

router.post("/blog", createPost);
router.delete("/blog/:id", deletePost);
router.get("/blog/:id", getPost);
router.get("/blog", getAllPost);
router.put("/blog/:id", updatePost);

export default router;
