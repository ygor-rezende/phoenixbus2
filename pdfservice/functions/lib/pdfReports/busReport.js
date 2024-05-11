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
const BusesReport = props => {
  const {
    data,
    startDate,
    endDate
  } = props;

  //Select only vehicles data
  const vehiclesData = data?.map(e => {
    let info;
    if (!e.use_farmout) {
      info = {
        vehicle_id: e.vehicle_id,
        vehicle_name: e.vehicle_name,
        vehicle_model: e.vehicle_model,
        end_time: e.end_time,
        start_time: e.start_time,
        spot_time: e.spot_time,
        end_location: e.return_location ? e.return_location : e.to_location,
        end_address: e.return_location ? e.return_address : e.to_address,
        end_city: e.return_location ? e.return_city : e.to_city,
        driver: e.firstname + " " + e.lastname
      };
    }
    return info;
  })?.filter(e => e);

  //Sort by name
  vehiclesData.sort((a, b) => {
    return a.vehicle_name - b.vehicle_name;
  });

  //create a unique list of vehicles
  const uniqueVehicles = [...new Map(vehiclesData.map(e => [e?.vehicle_id, e])).values()];
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Buses Report")), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), /*#__PURE__*/React.createElement(Text, {
    style: styles.h2
  }, startDate === endDate ? dayjs(startDate).format("dddd, MMMM D, YYYY") : dayjs(startDate).format("dddd, MMMM D, YYYY").concat(" to ", dayjs(endDate).format("dddd, MMMM D, YYYY"))), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "8%",
    align: "left"
  }, "Bus"), /*#__PURE__*/React.createElement(TableCell, {
    width: "15%",
    align: "left"
  }, "Driver"), /*#__PURE__*/React.createElement(TableCell, {
    width: "10%",
    align: "left"
  }, "Yard"), /*#__PURE__*/React.createElement(TableCell, {
    width: "10%",
    align: "left"
  }, "Start"), /*#__PURE__*/React.createElement(TableCell, {
    width: "10%",
    align: "left"
  }, "Return"), /*#__PURE__*/React.createElement(TableCell, {
    width: "47%",
    align: "left"
  }, "Return Location")), /*#__PURE__*/React.createElement(View, {
    style: {
      marginTop: 10
    }
  }, vehiclesData?.map((row, index) => {
    return /*#__PURE__*/React.createElement(View, {
      key: row.vehicle_id,
      style: {
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement(TableRow, {
      bgColor: index % 2 === 0 ? "#dcdcdc" : "white"
    }, /*#__PURE__*/React.createElement(TableCell, {
      width: "8%",
      align: "left"
    }, row?.vehicle_name), /*#__PURE__*/React.createElement(TableCell, {
      width: "15%",
      align: "left"
    }, row?.driver), /*#__PURE__*/React.createElement(TableCell, {
      width: "10%",
      align: "left"
    }, dayjs(row?.spot_time).format("HH:mm")), /*#__PURE__*/React.createElement(TableCell, {
      width: "10%",
      align: "left"
    }, dayjs(row?.start_time).format("HH:mm")), /*#__PURE__*/React.createElement(TableCell, {
      width: "10%",
      align: "left"
    }, row?.end_time ? dayjs(row?.end_time).format("HH:mm") : ""), /*#__PURE__*/React.createElement(TableCell, {
      width: "47%",
      align: "left"
    }, row?.end_location, " - ", row?.end_address, ",", " ", row?.end_city)));
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
export default BusesReport;