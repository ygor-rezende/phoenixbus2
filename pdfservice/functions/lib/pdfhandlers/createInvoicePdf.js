const React = require("react");
const path = require("path");
const {
  renderToStream,
  renderToFile
} = require("@react-pdf/renderer");
const {
  localDayjs
} = require("../helpers/localDayjs");
const Invoice = require("../pdfReports/invoice");
async function createInvoiceStream(data) {
  try {
    return await renderToStream( /*#__PURE__*/React.createElement(Invoice, {
      date: localDayjs(data.trip_start_date).format("dddd, MMMM D, YYYY"),
      invoiceNum: data.invoice,
      client: data.client,
      passengers: data.passengers,
      bookingDate: localDayjs(data.bookingDate).format("MM/DD/YYYY"),
      arrival: localDayjs(data.arrival).format("MM/DD/YYYY"),
      departure: localDayjs(data.departure).format("MM/DD/YYYY"),
      services: data.services,
      transactions: data.transactions,
      poRef: data.poRef,
      responsible: data.responsible,
      responsibleEmail: data.responsibleEmail
    }));
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function createInvoiceFile(invoiceData, servicesData, transactionsData) {
  try {
    //handle path to save
    let publicDir = path.resolve(__dirname, "../../public");
    //console.log(data);

    await renderToFile( /*#__PURE__*/React.createElement(Invoice, {
      date: localDayjs(invoiceData.trip_start_date).format("dddd, MMMM D, YYYY"),
      invoiceNum: invoiceData.invoice,
      client: invoiceData,
      passengers: invoiceData.num_people,
      bookingDate: localDayjs(invoiceData.booking_date).format("MM/DD/YYYY"),
      arrival: localDayjs(invoiceData.trip_end_date).format("MM/DD/YYYY"),
      departure: localDayjs(invoiceData.trip_start_date).format("MM/DD/YYYY"),
      services: servicesData,
      transactions: transactionsData,
      poRef: invoiceData.client_comments,
      responsible: invoiceData.responsible_name,
      responsibleEmail: invoiceData.responsible_email
    }), `${publicDir}/${invoiceData.invoice}.pdf`);
    return `${invoiceData.invoice}.pdf`;
  } catch (error) {
    console.log(error);
    return error;
  }
}
module.exports = {
  createInvoiceFile,
  createInvoiceStream
};