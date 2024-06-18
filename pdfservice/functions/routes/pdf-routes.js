const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const logger = require("firebase-functions/logger");
const {
  createQuoteStream,
  createQuoteFile,
} = require("../lib/pdfhandlers/createPdf");
const {
  createDriverOrderStream,
  createDriverOrderFile,
} = require("../lib/pdfhandlers/createDriverPdf");

const {
  createInvoiceFile,
  createInvoiceStream,
} = require("../lib/pdfhandlers/createInvoicePdf");

//Route to generate quote pdf
router.post("/quote/:responseType", bodyParser.json(), async (req, res) => {
  try {
    const { data } = req.body;
    const { responseType } = req.params;

    if (!data)
      return res.status(400).json({ message: "Bad request: Missing data." });

    if (responseType === "stream") {
      const pdfStream = await createQuoteStream(data);
      res.contentType("application/pdf");
      pdfStream.pipe(res);
      pdfStream.on("end", () => console.log("Done streaming, response sent."));
    } else if (responseType === "newfile") {
      const filename = await createQuoteFile(data);
      res.status(200).json(filename);
    } else {
      return res
        .status(400)
        .json({ message: "Bad request: Missing responseType." });
    }
  } catch (err) {
    logger.error("Error route /quote: ", err);
    res.status(500).json({ message: "Error generating quote pdf: " + err });
  }
});

//Route to generate invoice pdf
router.post("/invoice/:responseType", bodyParser.json(), async (req, res) => {
  try {
    const { invoiceData, servicesData, transactionsData } = req.body;
    const { responseType } = req.params;

    if (!invoiceData || !servicesData || !transactionsData)
      return res.status(400).json({ message: "Bad request: Missing data." });

    if (responseType === "stream") {
      const pdfStream = await createInvoiceStream(data);
      res.contentType("application/pdf");
      pdfStream.pipe(res);
      pdfStream.on("end", () => console.log("Done streaming, response sent."));
    } else if (responseType === "newfile") {
      const filename = await createInvoiceFile(
        invoiceData,
        servicesData,
        transactionsData
      );
      res.status(200).json(filename);
    } else {
      return res
        .status(400)
        .json({ message: "Bad request: Missing responseType." });
    }
  } catch (err) {
    logger.error("Error route /invoice: ", err);
    res.status(500).json({ message: "Error generating invoice pdf: " + err });
  }
});

//Route to generate driver pdf
router.post(
  "/driverOrder/:responseType",
  bodyParser.json(),
  async (req, res) => {
    try {
      const { data } = req.body;
      const { responseType } = req.params;

      if (!data)
        return res.status(400).json({ message: "Bad request: Missing data." });

      if (responseType === "stream") {
        const pdfStream = await createDriverOrderStream(data);
        res.contentType("application/pdf");
        pdfStream.pipe(res);
        pdfStream.on("end", () =>
          console.log("Done streaming, response sent.")
        );
      } else if (responseType === "newfile") {
        const filename = await createDriverOrderFile(data);
        res.status(200).json(filename);
      } else {
        return res
          .status(400)
          .json({ message: "Bad request: Missing responseType." });
      }
    } catch (err) {
      console.error("Error route /quote: ", err);
      logger.error("Error route /quote: ", err);
      res.status(500).json({ message: "Error generating driver pdf: " + err });
    }
  }
);

module.exports = router;
