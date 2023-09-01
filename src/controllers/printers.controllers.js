"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPrinterPage = exports.sendTestPage = exports.getPrinter = exports.getPrinters = void 0;
const server_printer_direct_1 = __importDefault(require("@ditxonmilan/server-printer-direct"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const getPrinters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield server_printer_direct_1.default.getPrinters();
        if (data) {
            return res.json({
                status: true,
                app: "server-printer",
                route: "get:://printers",
                response: data,
            });
        }
    }
    catch (err) { }
});
exports.getPrinters = getPrinters;
const getPrinter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const data = yield server_printer_direct_1.default.getPrinter(name);
        if (data) {
            return res.json({
                status: true,
                app: "server-printer",
                route: "get:://printer/:{name}:",
                response: data,
            });
        }
    }
    catch (err) { }
});
exports.getPrinter = getPrinter;
const sendTestPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nameprinter } = req.params;
        server_printer_direct_1.default.printDirect({
            printer: nameprinter,
            data: fs_1.default.readFileSync("public/testPage.pdf"),
            options: {
                name: "ss",
            },
            //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
            type: "RAW",
            success: function (jobID) {
                return res.json({
                    status: true,
                    app: "server-printer",
                    route: "post:://printer/test/:{nameprinter}:",
                    response: {
                        name: "Pagina de prueba",
                        process: jobID,
                    },
                });
            },
            error: function (err) {
                return res.json({
                    status: false,
                    app: "server-printer",
                    route: "post:://printer/test/:{nameprinter}:",
                    error: err,
                });
            },
        });
    }
    catch (err) {
        return res.json({
            status: false,
            app: "server-printer",
            route: "post:://printer/test/:{nameprinter}:",
            error: err,
        });
    }
});
exports.sendTestPage = sendTestPage;
const sendPrinterPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nameprinter, name } = req.params;
        let type;
        let route;
        let storage = multer_1.default.diskStorage({
            destination: function (req, file, callback) {
                return __awaiter(this, void 0, void 0, function* () {
                    const path = yield "./public/";
                    if (path) {
                        callback(null, "./public/");
                        route = path;
                    }
                });
            },
            filename: function (req, file, callback) {
                let fileName = file.originalname.split(".");
                type = fileName[fileName.length - 1];
                callback(null, "page" + "." + type);
            },
        });
        let upload = (0, multer_1.default)({ storage: storage }).single("file");
        upload(req, res, function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    throw new Error("No se pudo cargar el archivo");
                }
                else {
                    server_printer_direct_1.default.printDirect({
                        printer: nameprinter,
                        data: fs_1.default.readFileSync(route + "page.pdf"),
                        //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
                        type: "RAW",
                        success: function (jobID) {
                            return res.json({
                                status: true,
                                app: "server-printer",
                                route: "post:://printer/send/:{nameprinter}:",
                                response: {
                                    name: "page",
                                    process: jobID,
                                },
                            });
                        },
                        error: function (err) {
                            return res.json({
                                status: false,
                                app: "server-printer",
                                route: "post:://printer/send/:{nameprinter}:",
                                error: err,
                            });
                        },
                    });
                }
            });
        });
    }
    catch (err) {
        return res.json({
            status: false,
            app: "server-printer",
            route: "post:://printer/send/:{nameprinter}:",
            error: err,
        });
    }
});
exports.sendPrinterPage = sendPrinterPage;
