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
    fontSize: 12
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify"
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: 700
  },
  textItalic: {
    fontFamily: "Roboto",
    fontSize: 12,
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
const PayrollReport = props => {
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
  let totalPayment = data.reduce((sum, cur) => {
    return sum + Number(cur.payment);
  }, 0);
  totalPayment = currencyFormatter.format(totalPayment);
  let totalGratuity = data.reduce((sum, cur) => {
    return sum + Number(cur.gratuity);
  }, 0);
  totalGratuity = currencyFormatter.format(totalGratuity);
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
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "25%",
    align: "left",
    fontSize: 12
  }, "Name"), /*#__PURE__*/React.createElement(TableCell, {
    width: "25%",
    align: "right",
    fontSize: 12
  }, "Payment"), /*#__PURE__*/React.createElement(TableCell, {
    width: "25%",
    align: "right",
    fontSize: 12
  }, "Gratuity"), /*#__PURE__*/React.createElement(TableCell, {
    width: "25%",
    align: "right",
    fontSize: 12
  }, "Total")), /*#__PURE__*/React.createElement(View, {
    style: {
      marginTop: 10
    }
  }, data?.map((row, index) => {
    return /*#__PURE__*/React.createElement(TableRow, {
      key: row.vehicle_id,
      bgColor: index % 2 === 0 ? "#dcdcdc" : "white"
    }, /*#__PURE__*/React.createElement(TableCell, {
      width: "25%",
      align: "left",
      fontSize: 12
    }, row?.driver), /*#__PURE__*/React.createElement(TableCell, {
      width: "25%",
      align: "right",
      fontSize: 12
    }, currencyFormatter.format(row?.payment)), /*#__PURE__*/React.createElement(TableCell, {
      width: "25%",
      align: "right",
      fontSize: 12
    }, currencyFormatter.format(row?.gratuity)), /*#__PURE__*/React.createElement(TableCell, {
      width: "25%",
      align: "right",
      fontSize: 12
    }, currencyFormatter.format(row?.total)));
  })))), /*#__PURE__*/React.createElement(View, {
    style: styles.totalsSection
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      fontSize: 16,
      marginTop: 10
    }
  }, "Summary for the period"), /*#__PURE__*/React.createElement(View, {
    style: [styles.textBold, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, "Total Payment"), /*#__PURE__*/React.createElement(Text, null, "Total Gratuity")), /*#__PURE__*/React.createElement(View, {
    style: [styles.text, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, totalPayment), /*#__PURE__*/React.createElement(Text, null, totalGratuity))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
export default PayrollReport;