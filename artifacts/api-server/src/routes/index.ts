import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import assignmentsRouter from "./assignments";
import submissionsRouter from "./submissions";
import filesRouter from "./files";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(assignmentsRouter);
router.use(submissionsRouter);
router.use(filesRouter);

export default router;
