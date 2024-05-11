import React from "react";
import { Page, Text, Image, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
import PhoenixLogo from "../../images/phoenix_logo.png";
import PlaceIcon from "../../images/Location-Icon-1.png";
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
  textAllCaps: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase"
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
    borderTop: 1,
    borderBottom: 1
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
const FarmoutReport = props => {
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

  // Function to find items that repeat more than twice based on specified properties
  function findRepeats(data, properties) {
    const counts = {};

    // Count occurrences of each key
    data.forEach(obj => {
      const key = properties.map(prop => obj[prop]).join("|");
      counts[key] = (counts[key] || 0) + 1;
    });

    // Get the keys of the counts
    const repeats = Object.keys(counts);

    // Map the repeating items with their counts
    const result = repeats.map(key => {
      return {
        item: data.find(obj => properties.map(prop => obj[prop]).join("|") === key),
        count: counts[key]
      };
    });
    return result;
  }

  // Specify properties for comparison
  const comparisonProperties = ["service_date", "spot_time", "start_time", "return_time", "from_location_id", "to_location_id", "return_location_id", "additional_stop_detail", "additional_stop_info", "payment"];

  // Find items that repeat more than twice
  const repeats = findRepeats(data, comparisonProperties);
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Service Request"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textAllCaps
  }, data[0].company_name)), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), repeats.map((item, index) => {
    return /*#__PURE__*/React.createElement(View, {
      key: item.item.detail_id
    }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
      style: styles.h2
    }, dayjs(item?.item.service_date).format("dddd, MMMM D, YYYY")), /*#__PURE__*/React.createElement(Text, {
      style: [styles.textBold, {
        textAlign: "center",
        marginBottom: 10
      }]
    }, "***MILITARY TIME (24-HOUR CLOCK)***")), /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
      style: styles.h2
    }, "Service ", index + 1)), /*#__PURE__*/React.createElement(View, {
      style: styles.tableSection
    }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, "Client: ", item?.item.agency), /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: {
        fontWeight: 100
      }
    }, "Contact: ", item?.item.contact, " ", formatPhoneNumber(item?.item.phone)))), /*#__PURE__*/React.createElement(View, {
      style: {
        marginTop: 10,
        marginLeft: 80
      }
    }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, "Invoice: ", item?.item.invoice), /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, "Service Type:", " ", serviceTypes.find(e => e.type === item?.item.service_code)?.name || item?.item.service_code))), /*#__PURE__*/React.createElement(View, {
      style: {
        marginLeft: 80
      }
    }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, "Number of Buses: ", item?.count)), /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, "Payment per Bus:", " ", currencyFormatter.format(item?.item.payment)))), /*#__PURE__*/React.createElement(View, {
      style: {
        marginLeft: 80
      }
    }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }), /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, "Total Payment:", " ", currencyFormatter.format(item?.item.payment * item?.count))))))), /*#__PURE__*/React.createElement(View, {
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
    }, "."), item?.item.additional_stop_detail === "OutWard" || item?.item.additional_stop_detail === "Both" ? /*#__PURE__*/React.createElement(View, {
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
    }), item?.item.additional_stop_detail === "Both" || item?.item.additional_stop_detail === "Return" ? /*#__PURE__*/React.createElement(View, {
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
    }, ".")) : null, item?.item.return_location ? /*#__PURE__*/React.createElement(View, {
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
    }, "Spot time: "), item?.item.start_time ? dayjs(item?.item.start_time).subtract(15, "m").format("HH:mm") : ""), /*#__PURE__*/React.createElement(Text, {
      style: styles.text
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, "Start time: "), item?.item.start_time ? dayjs(item?.item.start_time).format("HH:mm") : "")), /*#__PURE__*/React.createElement(View, {
      style: {
        width: "75%"
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.text
    }, "PICK UP LOCATION:", " ", /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, item?.item.from_location)), /*#__PURE__*/React.createElement(Text, {
      style: [styles.text, {
        marginLeft: 90
      }]
    }, item?.item.from_address), /*#__PURE__*/React.createElement(Text, {
      style: [styles.text, {
        marginLeft: 90
      }]
    }, item?.item.from_city, ", ", item?.item.from_state))), (item?.item.additional_stop_detail === "Both" || item?.item.additional_stop_detail === "OutWard") && /*#__PURE__*/React.createElement(View, {
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
    }, item?.item.additional_stop_info)))), /*#__PURE__*/React.createElement(View, {
      style: [styles.header, {
        marginTop: 20
      }]
    }, /*#__PURE__*/React.createElement(View, {
      style: {
        width: "17%"
      }
    }, item?.item.return_location && /*#__PURE__*/React.createElement(Text, {
      style: styles.text
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, "Return time: "), item?.item.return_time ? dayjs(item?.item.return_time).format("HH:mm") : "")), /*#__PURE__*/React.createElement(View, {
      style: {
        width: "75%"
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.text
    }, "DROP OFF LOCATION:", " ", /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, item?.item.to_location)), /*#__PURE__*/React.createElement(Text, {
      style: [styles.text, {
        marginLeft: 99
      }]
    }, item?.item.to_address), /*#__PURE__*/React.createElement(Text, {
      style: [styles.text, {
        marginLeft: 99
      }]
    }, item?.item.to_city, ", ", item?.item.to_state))), (item?.item.additional_stop_detail === "Both" || item?.item.additional_stop_detail === "Return") && /*#__PURE__*/React.createElement(View, {
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
    }, item?.item.additional_stop_info)))), item?.item.return_location ? /*#__PURE__*/React.createElement(View, {
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
    }, item?.item.return_location)), /*#__PURE__*/React.createElement(Text, {
      style: [styles.text, {
        marginLeft: 75
      }]
    }, item?.item.return_address), /*#__PURE__*/React.createElement(Text, {
      style: [styles.text, {
        marginLeft: 75
      }]
    }, item?.item.return_city, ", ", item?.item.return_state))) : null)), /*#__PURE__*/React.createElement(Text, {
      style: [styles.textBold, {
        marginTop: 10
      }]
    }, "Instructions: ", item?.item.instructions)));
  }), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
export default FarmoutReport;