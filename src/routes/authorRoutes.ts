import { Router } from "express";

import {
  createAuthor,
  getAllAuthor,
  deleteAuthor,
  updateAuthor,
} from "../controllers/authorController";

const router = Router();

router.post("/author", createAuthor);
router.get("/author", getAllAuthor);
router.delete("/author/:id", deleteAuthor);
router.put("/author/:id", updateAuthor);

export default router;
