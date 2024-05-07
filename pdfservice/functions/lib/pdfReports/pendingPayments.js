import React from "react";
import { Page, Text, Image, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
import PhoenixLogo from "../../images/phoenix_logo.png";
import Roboto from "../../fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "../../fonts/Roboto/Roboto-Bold.ttf";
import RobotoItalic from "../../fonts/Roboto/Roboto-Italic.ttf";
import { Table, TableCell, TableHeader, TableRow } from "./Table";
import dayjs from "dayjs";
Font.register({
  family: "Roboto",
  fonts: [{
    src: Roboto
  }, {
    src: RobotoBold,
    fontWeight: 700
  }, {
    src: RobotoItalic,
    fontStyle: "italic"
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
    textAlign: "center",
    marginTop: 10
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15
  },
  image2: {
    width: "170px"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center"
  },
  header2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 20,
    borderTop: 1,
    alignItems: "center"
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 10
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify"
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: 700
  },
  textItalic: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontStyle: "italic"
  },
  h2: {
    fontSize: 16,
    fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 10
  },
  innerBoard: {
    marginLeft: 10
  },
  contentSection: {
    marginTop: 20,
    marginBottom: 10,
    borderTop: 1
  },
  tableSection: {
    borderTop: 1
  },
  signatureSection: {
    marginTop: 30,
    fontSize: 11,
    marginBottom: 30
  },
  signature: {
    textAlign: "left",
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 10
  },
  serviceRow: {
    marginBottom: 3,
    fontWeight: "semibold",
    borderBottom: 0.5
  },
  detailsRow: {
    marginBottom: 5
  },
  detailsSection: {
    marginBottom: 10
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: 1,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row"
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontSize: "9"
  }
});
const PendingPaymentsReport = props => {
  const {
    data,
    date
  } = props;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  const cliData = data?.map(e => {
    return {
      clientId: e.client_id,
      agency: e.agency,
      balance: data?.filter(item => item.client_id === e.client_id)?.reduce((sum, cur) => {
        return sum + Number(cur.invoice_balance);
      }, 0),
      received: data?.filter(item => e.client_id === item.client_id)?.reduce((sum, cur) => {
        return sum + Number(cur.amount_paid);
      }, 0)
    };
  });
  const uniqueClients = [...new Map(cliData.map(e => [e.clientId, e])).values()];

  //sum all sales up
  let totalSales = data.reduce((sum, cur) => {
    return sum + Number(cur.cost);
  }, 0);
  let totalReceived = data.reduce((sum, cur) => {
    return sum + Number(cur.amount_paid);
  }, 0);
  let totalBalance = data.reduce((sum, cur) => {
    return sum + Number(cur.invoice_balance);
  }, 0);

  //calculate the percentual of sales for each client and add it to data

  totalSales = currencyFormatter.format(totalSales);
  totalReceived = currencyFormatter.format(totalReceived);
  totalBalance = currencyFormatter.format(totalBalance);
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Pending Invoices")), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), /*#__PURE__*/React.createElement(Text, {
    style: styles.h2
  }, date), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "29%",
    align: "left"
  }, "Agency"), /*#__PURE__*/React.createElement(TableCell, {
    width: "15%",
    align: "left"
  }, "Invoice"), /*#__PURE__*/React.createElement(TableCell, {
    width: "10%",
    align: "left"
  }, "Date"), /*#__PURE__*/React.createElement(TableCell, {
    width: "10%",
    align: "right"
  }, "Age"), /*#__PURE__*/React.createElement(TableCell, {
    width: "12%",
    align: "right"
  }, "Amount"), /*#__PURE__*/React.createElement(TableCell, {
    width: "12%",
    align: "right"
  }, "Received"), /*#__PURE__*/React.createElement(TableCell, {
    width: "12%",
    align: "right"
  }, "Balance")), /*#__PURE__*/React.createElement(View, null, uniqueClients?.map(row => {
    const services = data?.filter(e => e.client_id === row.clientId);
    return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(View, {
      style: [{
        borderBottom: 0.5,
        marginTop: 10
      }, styles.textBold]
    }, /*#__PURE__*/React.createElement(TableRow, {
      key: row.clientId
    }, /*#__PURE__*/React.createElement(TableCell, {
      width: "76%",
      align: "left"
    }, row?.agency), /*#__PURE__*/React.createElement(TableCell, {
      width: "12%",
      align: "right"
    }, currencyFormatter.format(row?.received)), /*#__PURE__*/React.createElement(TableCell, {
      width: "12%",
      align: "right"
    }, currencyFormatter.format(row?.balance)))), /*#__PURE__*/React.createElement(View, null, services?.map((serv, index) => {
      return /*#__PURE__*/React.createElement(TableRow, {
        key: index
      }, /*#__PURE__*/React.createElement(TableCell, {
        width: "29%",
        align: "left"
      }, serv.service_name), /*#__PURE__*/React.createElement(TableCell, {
        width: "15%",
        align: "left"
      }, serv.invoice), /*#__PURE__*/React.createElement(TableCell, {
        width: "10%",
        align: "left"
      }, dayjs(serv.start_date).format("l")), /*#__PURE__*/React.createElement(TableCell, {
        width: "10%",
        align: "right"
      }, dayjs(new Date()).diff(serv.start_date, "days")), /*#__PURE__*/React.createElement(TableCell, {
        width: "12%",
        align: "right"
      }, currencyFormatter.format(serv.cost)), /*#__PURE__*/React.createElement(TableCell, {
        width: "12%",
        align: "right"
      }, currencyFormatter.format(serv.amount_paid)), /*#__PURE__*/React.createElement(TableCell, {
        width: "12%",
        align: "right"
      }, currencyFormatter.format(serv.invoice_balance)));
    })));
  })))), /*#__PURE__*/React.createElement(View, {
    style: styles.totalsSection
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      fontSize: 16,
      marginTop: 10
    }
  }, "Summary"), /*#__PURE__*/React.createElement(View, {
    style: [styles.textBold, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, null, "Total Sales"), /*#__PURE__*/React.createElement(Text, null, "Total Received"), /*#__PURE__*/React.createElement(Text, null, "Total Balance")), /*#__PURE__*/React.createElement(View, {
    style: [styles.text, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, null, totalSales), /*#__PURE__*/React.createElement(Text, null, totalReceived), /*#__PURE__*/React.createElement(Text, null, totalBalance))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
export default PendingPaymentsReport;