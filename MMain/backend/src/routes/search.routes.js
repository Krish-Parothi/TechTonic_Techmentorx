import express from "express";
import { searchController } from "../controllers/search.controller.js";

const router = express.Router();

router.post("/", searchController);

export default router;
