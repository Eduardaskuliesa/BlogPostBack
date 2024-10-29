import express from "express";

import {
  createAuthor,
  getAllAuthor,
  deleteAuthor,
} from "../controllers/authorController";

const router = express.Router();

router.post("/author", createAuthor);
router.get("/author", getAllAuthor);

export default router;
