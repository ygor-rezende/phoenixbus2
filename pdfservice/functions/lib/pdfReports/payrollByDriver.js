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
  textBig: {
    fontFamily: "Roboto",
    fontSize: 14
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
    marginLeft: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
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
    paddingTop: 10,
    borderBottom: 1,
    display: "flex",
    justifyContent: "flex-end",
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
const PayrollByDriver = props => {
  const {
    data,
    startDate,
    endDate
  } = props;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  //Group drivers and sum total payment and gratuity for each
  const empData = data?.map(e => {
    const totalPay = data?.filter(item => item.employee_id === e.employee_id)?.reduce((sum, cur) => {
      return sum + Number(cur.payment);
    }, 0);
    const totalGrat = data?.filter(item => item.employee_id === e.employee_id)?.reduce((sum, cur) => {
      return sum + Number(cur.gratuity);
    }, 0);
    return {
      empId: e.employee_id,
      driver: e.driver,
      totPay: totalPay,
      totGrat: totalGrat
    };
  });

  //creates an unique list
  const uniqueEmployees = [...new Map(empData.map(e => [e.empId, e])).values()];
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Drivers' Payroll")), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), /*#__PURE__*/React.createElement(Text, {
    style: styles.h2
  }, startDate === endDate ? startDate : startDate.concat(" to ", endDate)), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(View, null, uniqueEmployees?.map(row => {
    const services = data?.filter(e => e.employee_id === row.empId);
    return /*#__PURE__*/React.createElement(View, {
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.textBig
    }, "Driver: ", row?.driver), /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "10%",
      align: "left"
    }, "Date"), /*#__PURE__*/React.createElement(TableCell, {
      width: "8%",
      align: "left"
    }, "Start"), /*#__PURE__*/React.createElement(TableCell, {
      width: "8%",
      align: "left"
    }, "End"), /*#__PURE__*/React.createElement(TableCell, {
      width: "21%",
      align: "left"
    }, "From"), /*#__PURE__*/React.createElement(TableCell, {
      width: "21%",
      align: "left"
    }, "To"), /*#__PURE__*/React.createElement(TableCell, {
      width: "12%",
      align: "right"
    }, "Invoice"), /*#__PURE__*/React.createElement(TableCell, {
      width: "10%",
      align: "right"
    }, "Payment"), /*#__PURE__*/React.createElement(TableCell, {
      width: "10%",
      align: "right"
    }, "Gratuity"))), /*#__PURE__*/React.createElement(View, null, services?.map((serv, index) => {
      return /*#__PURE__*/React.createElement(TableRow, {
        key: index
      }, /*#__PURE__*/React.createElement(TableCell, {
        width: "10%",
        align: "left"
      }, dayjs(serv.service_date).format("l")), /*#__PURE__*/React.createElement(TableCell, {
        width: "8%",
        align: "left"
      }, serv.start_time ? dayjs(serv.start_time).format("HH:mm") : ""), /*#__PURE__*/React.createElement(TableCell, {
        width: "8%",
        align: "left"
      }, serv.end_time ? dayjs(serv.end_time).format("HH:mm") : ""), /*#__PURE__*/React.createElement(TableCell, {
        width: "21%",
        align: "left"
      }, serv.location_from), /*#__PURE__*/React.createElement(TableCell, {
        width: "21%",
        align: "left"
      }, serv.location_to), /*#__PURE__*/React.createElement(TableCell, {
        width: "12%",
        align: "right"
      }, serv.invoice), /*#__PURE__*/React.createElement(TableCell, {
        width: "10%",
        align: "right"
      }, currencyFormatter.format(serv.payment)), /*#__PURE__*/React.createElement(TableCell, {
        width: "10%",
        align: "right"
      }, currencyFormatter.format(serv.gratuity)));
    })), /*#__PURE__*/React.createElement(View, {
      style: styles.totalsSection
    }, /*#__PURE__*/React.createElement(View, {
      style: [styles.textBold, styles.innerBoard]
    }, /*#__PURE__*/React.createElement(Text, null, "Payments:"), /*#__PURE__*/React.createElement(Text, null, "Gratuities:"), /*#__PURE__*/React.createElement(Text, null, "Total:")), /*#__PURE__*/React.createElement(View, {
      style: [styles.text, styles.innerBoard]
    }, /*#__PURE__*/React.createElement(Text, null, currencyFormatter.format(row.totPay)), /*#__PURE__*/React.createElement(Text, null, currencyFormatter.format(row.totGrat)), /*#__PURE__*/React.createElement(Text, null, currencyFormatter.format(row.totGrat + row.totPay)))));
  })))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
export default PayrollByDriver;