import express from "express";
import adminController from "../../../adapters/adminController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";

//middlewares
import requireAdmin from "../middlewares/requireAdmin";
import requestLimiter from "../middlewares/requestLimiter";

const adminRouter = () => {
    const router = express();

    const controller = adminController(
        authService,
        authServiceInterface,
    )

    //routes
    router.post('/login', requestLimiter, controller.adminLogin);

    return router;
}

export default adminRouter;