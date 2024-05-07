const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const logger = require("firebase-functions/logger");
const { createQuoteStream } = require("../lib/pdfhandlers/createPdf");

router.get("/", (req, res) => {
  res.send("Hello!");
});

router.post("/quote", bodyParser.json(), async (req, res) => {
  try {
    const { data } = req.body;
    if (!data)
      return res.status(400).json({ message: "Bad request: Missing data." });

    const pdfStream = await createQuoteStream(data);
    res.contentType("application/pdf");
    pdfStream.pipe(res);
    pdfStream.on("end", () => console.log("Done streaming, response sent."));
  } catch (err) {
    console.error("Error route /quote: ", err);
    logger.error("Error route /quote: ", err);
    res.status(500).json({ message: "Error generating quote pdf: " + err });
  }
});

module.exports = router;
