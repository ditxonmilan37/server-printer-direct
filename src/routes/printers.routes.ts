import { Router } from "express";
import {
  getPrinters,
  getPrinter,
  sendTestPage,
  sendPrinterPage,
} from "../controllers/printers.controllers";

const router = Router();

router.get("/printers", getPrinters);
router.get("/printer/:name", getPrinter);
router.post("/printer/test/:nameprinter", sendTestPage);
router.post("/printer/send/:nameprinter", sendPrinterPage);

export default router;
