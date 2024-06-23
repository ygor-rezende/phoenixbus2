const React = require("react");
const {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font
} = require("@react-pdf/renderer");
const fs = require("fs");
const path = require("path");
const {
  localDayjs
} = require("../helpers/localDayjs");
const PhoenixLogo = fs.readFileSync(path.join(__dirname, "../images/phoenix_logo.png"));
const Roboto = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf";
const RobotoBold = "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf";
const RobotoItalic = "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf";
const {
  Table,
  TableRow,
  TableCell,
  TableHeader
} = require("./Table");
Font.register({
  family: "Roboto",
  fonts: [{
    src: Roboto
  }, {
    src: RobotoBold,
    fontWeight: 700
  }]
});
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto",
    textAlign: "center"
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 12
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: 700
  },
  tripBoard: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    border: 2
  },
  innerBoard: {
    margin: 10
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 30,
    borderTop: 1,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row"
  },
  tableSection: {
    borderTop: 1,
    marginTop: 30,
    marginBottom: 20
  },
  infoSection: {
    margin: 10,
    border: 2,
    padding: 10
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontSize: "10"
  }
});
const Invoice = props => {
  const {
    date,
    invoiceNum,
    client,
    passengers,
    bookingDate,
    arrival,
    departure,
    services,
    transactions,
    poRef,
    responsible,
    responsibleEmail
  } = props;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  //Exclude services that are Dead-Head
  const filteredServices = services.filter(e => e.service_code !== "DH");

  //Get total payment from transactions
  const totPay = transactions?.find(e => e.invoice === invoiceNum)?.total_pay || 0.0;

  //Total invoice
  let totalInvoice = filteredServices?.reduce((sum, current) => {
    return sum + Number(current.gratuity) + current.charge * current.qty;
  }, 0);
  let totalTax = filteredServices?.map(service => {
    return {
      tax: service.sales_tax,
      charge: service.charge,
      qty: service.qty
    };
  })?.reduce((sum, service) => {
    return sum + Number(service.tax * service.charge * service.qty) / 100;
  }, 0);
  let totalAmount = totalInvoice - totPay + totalTax;
  let credit = currencyFormatter.format(totPay);
  totalAmount = currencyFormatter.format(totalAmount);
  totalInvoice = currencyFormatter.format(totalInvoice);
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body,
    size: "LETTER"
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  }), /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Invoice / Receipt"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Date: ", date), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Invoice #: ", invoiceNum), poRef && /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "PO/REF #: ", poRef))), /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, null, "To: ", client.agency), /*#__PURE__*/React.createElement(Text, null, "Attn: ", client.contact), client.phone && /*#__PURE__*/React.createElement(Text, null, "Phone: ", client.phone), client.email && /*#__PURE__*/React.createElement(Text, null, "Email: ", client.email), client.address1 && /*#__PURE__*/React.createElement(Text, null, client.address1), client.address1 && /*#__PURE__*/React.createElement(Text, null, client.city, ", ", client.client_state), responsible && /*#__PURE__*/React.createElement(Text, null, "Responsible: ", responsible), responsibleEmail && /*#__PURE__*/React.createElement(Text, null, "Responsible Email: ", responsibleEmail)), /*#__PURE__*/React.createElement(View, {
    style: styles.tripBoard
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.textBold, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, null, "Passengers:"), /*#__PURE__*/React.createElement(Text, null, "Booking date:"), /*#__PURE__*/React.createElement(Text, null, "Arrival:"), /*#__PURE__*/React.createElement(Text, null, "Departure:")), /*#__PURE__*/React.createElement(View, {
    style: [styles.text, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, null, passengers), /*#__PURE__*/React.createElement(Text, null, bookingDate), /*#__PURE__*/React.createElement(Text, null, arrival), /*#__PURE__*/React.createElement(Text, null, departure)))), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    align: "left",
    width: "17%"
  }, "Date"), /*#__PURE__*/React.createElement(TableCell, {
    align: "left",
    width: "17%"
  }, "Service"), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, "Charge"), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, "Qty"), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, "Gratuity"), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, "Total")), filteredServices?.map(service => /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    align: "left",
    width: "17%"
  }, localDayjs(service.service_date).format("MM/DD/YYYY")), /*#__PURE__*/React.createElement(TableCell, {
    align: "left",
    width: "17%"
  }, service.service_name), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, currencyFormatter.format(service.charge)), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, service.qty), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, service.gratuity), /*#__PURE__*/React.createElement(TableCell, {
    align: "right",
    width: "17%"
  }, currencyFormatter.format(service.charge * service.qty + Number(service.gratuity))))))), /*#__PURE__*/React.createElement(View, {
    style: styles.totalsSection
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.textBold, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, "Total Invoice"), /*#__PURE__*/React.createElement(Text, null, "Total Payment/Credit"), /*#__PURE__*/React.createElement(Text, null, "Sales Tax:"), /*#__PURE__*/React.createElement(Text, null, "Total Amount Due")), /*#__PURE__*/React.createElement(View, {
    style: [styles.text, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, totalInvoice), /*#__PURE__*/React.createElement(Text, null, "(", credit, ")"), /*#__PURE__*/React.createElement(Text, null, totalTax > 0 ? currencyFormatter.format(totalTax) : "Waived"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, totalAmount))), /*#__PURE__*/React.createElement(View, {
    style: [styles.infoSection, styles.text]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, "5 CONVENIENT WAYS TO PAY"), /*#__PURE__*/React.createElement(Text, null, "1) CHECK, CASHIERS CHECK OR MONEY ORDER"), /*#__PURE__*/React.createElement(Text, null, "2) BANK TRANSFER (ASK US FOR WIRE INFO)"), /*#__PURE__*/React.createElement(Text, null, "3) CREDIT CARD VIA FORM(4% FEE) OR GO TO OUR WEBSITE"), /*#__PURE__*/React.createElement(Text, null, "4) ZELLE QUICK PAY APPLICATION (USE CONTACT@PHOENIXBUSORLANDO.COM)"), /*#__PURE__*/React.createElement(Text, null, "5) VIA PURCHASE ORDER")), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, null, "Thank you for your business"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
module.exports = Invoice;