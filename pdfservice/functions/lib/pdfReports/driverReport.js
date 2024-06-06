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
const PhoenixLogo = fs.readFileSync(path.join(__dirname, "../images/phoenix_logo.png"));
const PlaceIcon = fs.readFileSync(path.join(__dirname, "../images/Location-Icon-1.png"));
const Roboto = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf";
const RobotoBold = "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf";
const RobotoItalic = "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf";
const {
  Table,
  TableCell,
  TableHeader,
  TableRow
} = require("./Table");
const dayjs = require("dayjs");
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
    width: "20px"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "baseline"
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
  header3: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    alignItems: "baseline"
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
    marginBottom: 10,
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
const DriverReport = props => {
  const {
    data
  } = props;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  const serviceTypes = [{
    type: "RT",
    name: "ROUND-TRIP"
  }, {
    type: "CH",
    name: "CHARTER"
  }, {
    type: "OW",
    name: "ONE-WAY"
  }, {
    type: "DH",
    name: "DEAD-HEAD"
  }, {
    type: "SH",
    name: "SHUTTLE"
  }];
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  }
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Driver Order")), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), /*#__PURE__*/React.createElement(Text, {
    style: styles.h2
  }, dayjs(data?.service_date).format("dddd, MMMM D, YYYY")), /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      textAlign: "center",
      marginBottom: 10
    }]
  }, "***MILITARY TIME (24-HOUR CLOCK)***"), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, "Client: ", data?.agency), /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      fontWeight: 100
    }
  }, "Contact: ", data?.contact, " ", formatPhoneNumber(data?.phone)))), /*#__PURE__*/React.createElement(View, {
    style: {
      marginTop: 10,
      marginLeft: 80
    }
  }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, data?.use_farmout ? `Farmout Company: ${data?.company_name}` : `Driver: ${data?.firstname} ${data?.lastname}`), /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, "Service Type:", " ", serviceTypes.find(e => e.type === data?.service_code)?.name || data?.service_code))), /*#__PURE__*/React.createElement(View, {
    style: {
      marginLeft: 80
    }
  }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, "Payment: ", currencyFormatter.format(data?.payment)), /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, data?.use_farmout ? "Vehicle: Farm-out" : `Vehicle # ${data?.vehicle_name}`))), /*#__PURE__*/React.createElement(View, {
    style: {
      marginLeft: 80
    }
  }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "50%",
    align: "left"
  }, "Invoice: ", data?.invoice))))), /*#__PURE__*/React.createElement(View, {
    style: styles.contentSection
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header3
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      display: "grid",
      alignItems: "center",
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(Image, {
    src: PlaceIcon,
    style: styles.image2
  }), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), data?.additional_stop_detail === "OutWard" || data?.additional_stop_detail === "Both" ? /*#__PURE__*/React.createElement(View, {
    style: {
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, ".")) : null, /*#__PURE__*/React.createElement(Image, {
    src: PlaceIcon,
    style: styles.image2
  }), data?.additional_stop_detail === "Both" || data?.additional_stop_detail === "Return" ? /*#__PURE__*/React.createElement(View, {
    style: {
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, ".")) : null, data?.return_location ? /*#__PURE__*/React.createElement(View, {
    style: {
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      color: "blue"
    }]
  }, "."), /*#__PURE__*/React.createElement(Image, {
    src: PlaceIcon,
    style: styles.image2
  })) : null), /*#__PURE__*/React.createElement(View, {
    style: styles.innerBoard
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: "17%"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Yard: "), data?.spot_time ? dayjs(data?.spot_time).format("HH:mm") : ""), data?.spot_time && /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, dayjs(data?.spot_time).get("hour") < 12 ? "(morning)" : ""), /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Spot: "), data?.start_time ? dayjs(data?.start_time).subtract(15, "m").format("HH:mm") : ""), /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Start: "), data?.start_time ? dayjs(data?.start_time).format("HH:mm") : "")), /*#__PURE__*/React.createElement(View, {
    style: {
      width: "75%"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, "PICK UP LOCATION:", " ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, data?.from_location)), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      marginLeft: 90
    }]
  }, data?.from_address), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      marginLeft: 90
    }]
  }, data?.from_city, ", ", data?.from_state))), (data?.additional_stop_detail === "Both" || data?.additional_stop_detail === "OutWard") && /*#__PURE__*/React.createElement(View, {
    style: [styles.header, {
      marginTop: 20
    }]
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: "17%"
    }
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      width: "75%"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, "ADDITIONAL STOP:", " ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, data?.additional_stop_info)))), /*#__PURE__*/React.createElement(View, {
    style: [styles.header, {
      marginTop: 20
    }]
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: "17%"
    }
  }, data?.return_location && /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Return PickUp: "), data?.return_time ? dayjs(data?.return_time).format("HH:mm") : "")), /*#__PURE__*/React.createElement(View, {
    style: {
      width: "75%"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, "DROP OFF LOCATION:", " ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, data?.to_location)), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      marginLeft: 99
    }]
  }, data?.to_address), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      marginLeft: 99
    }]
  }, data?.to_city, ", ", data?.to_state))), (data?.additional_stop_detail === "Both" || data?.additional_stop_detail === "Return") && /*#__PURE__*/React.createElement(View, {
    style: [styles.header, {
      marginTop: 20
    }]
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: "17%"
    }
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      width: "75%"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, "ADDITIONAL STOP:", " ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, data?.additional_stop_info)))), data?.return_location ? /*#__PURE__*/React.createElement(View, {
    style: [styles.header, {
      marginTop: 20
    }]
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: "17%"
    }
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      width: "75%"
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, "END LOCATION:", " ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, data?.return_location)), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      marginLeft: 75
    }]
  }, data?.return_address), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, {
      marginLeft: 75
    }]
  }, data?.return_city, ", ", data?.return_state))) : null)), /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      marginTop: 10
    }]
  }, "Instructions: ", data?.instructions), /*#__PURE__*/React.createElement(View, {
    style: styles.header2
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      width: "30%",
      textAlign: "center"
    }]
  }, "PLEASE FUEL THE BUS: MINIMUM OF 3/4 TANK"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      width: "30%",
      textAlign: "center"
    }]
  }, "PARK THE CAR ON BUS SPOT"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      width: "30%",
      textAlign: "center"
    }]
  }, "LOG IN SAMSARA: COMPLETE PRE-TRIP WITH PICTURES"))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
module.exports = DriverReport;