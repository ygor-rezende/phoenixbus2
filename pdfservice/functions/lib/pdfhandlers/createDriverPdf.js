const React = require("react");
const path = require("path");
const {
  renderToStream,
  renderToFile
} = require("@react-pdf/renderer");
const DriverReport = require("../pdfReports/driverReport");

//create pdf stream
async function createDriverOrderStream(data) {
  try {
    return await renderToStream( /*#__PURE__*/React.createElement(DriverReport, {
      data: data
    }));
  } catch (error) {
    console.log(error);
    return error;
  }
}

//create pdf file
async function createDriverOrderFile(data, smsId) {
  try {
    //handle path to save
    let publicDir = path.resolve(__dirname, "../../public");
    //console.log(data);
    await renderToFile( /*#__PURE__*/React.createElement(DriverReport, {
      data: data,
      smsId: smsId
    }), `${publicDir}/driverReport_${data.detail_id}.pdf`);
    return `driverReport_${data.detail_id}.pdf`;
  } catch (error) {
    console.log(error);
    return error;
  }
}
module.exports = {
  createDriverOrderStream,
  createDriverOrderFile
};