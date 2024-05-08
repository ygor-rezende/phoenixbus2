const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const logger = require("firebase-functions/logger");
const {
  createQuoteStream,
  createQuoteFile,
} = require("../lib/pdfhandlers/createPdf");

router.get("/", (req, res) => {
  res.send("Hello!");
});

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
      res.json(filename);
    }
  } catch (err) {
    console.error("Error route /quote: ", err);
    logger.error("Error route /quote: ", err);
    res.status(500).json({ message: "Error generating quote pdf: " + err });
  }
});

module.exports = router;
