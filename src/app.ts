import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import printersRoute from "./routes/printers.routes";

const app = express();

app.use(express.static("public"));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(printersRoute);

app.use(bodyParser.json({ limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

export default app;
