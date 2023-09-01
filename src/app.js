"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const printers_routes_1 = __importDefault(require("./routes/printers.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(printers_routes_1.default);
app.use(body_parser_1.default.json({ limit: "200mb" }));
app.use(body_parser_1.default.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
}));
exports.default = app;
