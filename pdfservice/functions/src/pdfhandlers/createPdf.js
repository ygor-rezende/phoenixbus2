const React = require("react");
const path = require("path");

const { renderToStream, renderToFile } = require("@react-pdf/renderer");
const QuoteReport = require("../pdfReports/quote");
const dayjs = require("dayjs");

async function createQuoteStream(data) {
  try {
    return await renderToStream(
      <QuoteReport
        date={dayjs(data.quoteDate).format("dddd, MMMM D, YYYY")}
        invoiceNum={data.invoice}
        quotedCost={data.quotedCost}
        salesPerson={data.salesPerson}
        client={data.client}
        passengers={data.passengers}
        deposit={data.deposit}
        tripStart={dayjs(data.tripStart).format("dddd, MMMM D, YYYY")}
        tripEnd={dayjs(data.tripEnd).format("dddd, MMMM D, YYYY")}
        quoteExp={data.quoteExp}
        services={data.services}
        details={data.details}
        locations={data.locations}
        quoteDetails={data.quoteDetails}
      />
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function createQuoteFile(data) {
  try {
    //handle path to save
    let publicDir = path.resolve(__dirname, "../../public");
    //console.log(data);
    await renderToFile(
      <QuoteReport
        date={dayjs(data.date).format("dddd, MMMM D, YYYY")}
        invoiceNum={data.invoiceNum}
        quotedCost={data.quotedCost}
        salesPerson={data.salesPerson}
        client={data.client}
        passengers={data.passengers}
        deposit={data.deposit}
        tripStart={dayjs(data.tripStart).format("dddd, MMMM D, YYYY")}
        tripEnd={dayjs(data.tripEnd).format("dddd, MMMM D, YYYY")}
        quoteExp={data.quoteExp}
        services={data.services}
        details={data.details}
        locations={data.locations}
        quoteDetails={data.quoteDetails}
      />,
      `${publicDir}/${data.invoiceNum}.pdf`
    );
    return `${data.invoiceNum}.pdf`;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = { createQuoteStream, createQuoteFile };
