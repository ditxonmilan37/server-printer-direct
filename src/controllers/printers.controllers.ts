import { Request, Response } from "express";
import printer from "@ditxonmilan/server-printer-direct";
import fs from "fs";
import multer from "multer";

export const getPrinters = async (req: Request, res: Response) => {
  try {
    const data = await printer.getPrinters();

    if (data) {
      return res.json({
        status: true,
        app: "server-printer",
        route: "get:://printers",
        response: data,
      });
    }
  } catch (err) {}
};

export const getPrinter = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const data = await printer.getPrinter(name);

    if (data) {
      return res.json({
        status: true,
        app: "server-printer",
        route: "get:://printer/:{name}:",
        response: data,
      });
    }
  } catch (err) {}
};

export const sendTestPage = async (req: Request, res: Response) => {
  try {
    const { nameprinter } = req.params;

    printer.printDirect({
      printer: nameprinter,
      data: fs.readFileSync("public/testPage.pdf"), // or simple String: "some text"
      options: {
        name: "ss",
      },
      //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
      type: "RAW", // type: RAW, TEXT, PDF, JPEG, .. depends on platform
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
  } catch (err) {
    return res.json({
      status: false,
      app: "server-printer",
      route: "post:://printer/test/:{nameprinter}:",
      error: err,
    });
  }
};

export const sendPrinterPage = async (req: Request, res: Response) => {
  try {
    const { nameprinter, name } = req.params;
    let type: any;
    let route: any;
    let storage = multer.diskStorage({
      destination: async function (req, file, callback) {
        const path = await "./public/";

        if (path) {
          callback(null, "./public/");
          route = path;
        }
      },
      filename: function (req, file, callback) {
        let fileName = file.originalname.split(".");
        type = fileName[fileName.length - 1];
        callback(null, "page" + "." + type);
      },
    });

    let upload = multer({ storage: storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        throw new Error("No se pudo cargar el archivo");
      } else {
        printer.printDirect({
          printer: nameprinter,
          data: fs.readFileSync(route + "page.pdf"), // or simple String: "some text"
          //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
          type: "RAW", // type: RAW, TEXT, PDF, JPEG, .. depends on platform
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
  } catch (err) {
    return res.json({
      status: false,
      app: "server-printer",
      route: "post:://printer/send/:{nameprinter}:",
      error: err,
    });
  }
};
