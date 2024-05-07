/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const PORT = 8080;
const os = require("os");
const cors = require("cors");
const express = require("express");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const ROLES_LIST = require("./config/roles_list");

const pdfService = express();

//Handle fetch cookies credentials requirement
pdfService.use(credentials);

//Allow only a list of origins
pdfService.use(cors(corsOptions));

//Quotes
pdfService.use("/api/getpdf", require("./routes/pdf-routes"));

if (os.hostname().indexOf("LAPTOP") > -1)
  pdfService.listen(PORT, () => console.log(`Server running on port ${PORT}`));

exports.pdfService = onRequest(pdfService);
