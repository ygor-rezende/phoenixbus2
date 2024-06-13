const axios = require("axios");

const requestInvoicePdf = async (
  invoiceData,
  servicesData,
  transactionsData
) => {
  //request to create the pdf
  let response = await axios.post(`${process.env.PDFSERVICE}/invoice/newfile`, {
    invoiceData,
    servicesData,
    transactionsData,
  });

  return response?.data;
};

module.exports = requestInvoicePdf;
