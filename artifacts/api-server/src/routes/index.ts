import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import assignmentsRouter from "./assignments";
import submissionsRouter from "./submissions";
import filesRouter from "./files";
import lessonsRouter from "./lessons";
import scheduleRouter from "./schedule";
import parentRouter from "./parent";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(assignmentsRouter);
router.use(submissionsRouter);
router.use(filesRouter);
router.use(lessonsRouter);
router.use(scheduleRouter);
router.use(parentRouter);

export default router;
