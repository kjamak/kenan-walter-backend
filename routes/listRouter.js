import express from "express";
import {
  createList,
  deleteLists,
  getLists,
  modificateLists,
  getReport,
} from "../controllers/list.js";
import auth from "../middleware/auth.js";
import listAuth from "../middleware/listAuth.js";

const router = express.Router();

router.post("/create", auth, createList);
router.get("/get", auth, getLists);
router.post("/update", auth, listAuth, modificateLists);
router.delete("/delete", auth, listAuth, deleteLists);

router.post("/report", auth, getReport);

export default router;
