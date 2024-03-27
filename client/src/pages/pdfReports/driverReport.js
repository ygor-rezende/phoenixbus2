import React from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
} from "@react-pdf/renderer";
import PhoenixLogo from "../../images/phoenix_logo.png";
import PlaceIcon from "../../images/Location-Icon-1.png";
import Roboto from "../../fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "../../fonts/Roboto/Roboto-Bold.ttf";
import RobotoItalic from "../../fonts/Roboto/Roboto-Italic.ttf";
import { Table, TableCell, TableHeader, TableRow } from "./Table";

import dayjs from "dayjs";

Font.register({
  family: "Roboto",
  fonts: [
    { src: Roboto },
    { src: RobotoBold, fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 10,
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15,
  },
  image2: {
    width: "20px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  header2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 20,
    borderTop: 1,
    alignItems: "center",
  },
  header3: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 10,
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify",
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: 700,
  },
  textItalic: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontStyle: "italic",
  },
  h2: {
    fontSize: 16,
    fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 10,
  },
  innerBoard: {
    marginBottom: 10,
    marginLeft: 10,
  },
  contentSection: {
    marginTop: 20,
    marginBottom: 10,
    borderTop: 1,
  },
  tableSection: {
    borderTop: 1,
  },
  signatureSection: {
    marginTop: 30,
    fontSize: 11,
    marginBottom: 30,
  },
  signature: {
    textAlign: "left",
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 10,
  },
  serviceRow: {
    marginBottom: 3,
    fontWeight: "semibold",
    borderBottom: 0.5,
  },
  detailsRow: {
    marginBottom: 5,
  },
  detailsSection: {
    marginBottom: 10,
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: 1,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontSize: "9",
  },
});

const DriverReport = (props) => {
  const { data } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Driver Report</Text>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>
        <Text style={styles.h2}>
          Service Date: {dayjs(data?.service_date).format("l")}
        </Text>
        <Text
          style={[styles.textBold, { textAlign: "center", marginBottom: 10 }]}
        >
          ***MILITARY TIME (24-HOUR CLOCK)***
        </Text>
        <View style={styles.tableSection}>
          <Table>
            <TableHeader>
              <TableCell width="50%" align="left">
                Client: {data?.agency}
              </TableCell>
              <TableCell width="50%" align="right">
                Invoice: {data?.invoice}
              </TableCell>
            </TableHeader>
            <View style={{ marginTop: 10 }}>
              <TableRow>
                <TableCell width="50%" align="center">
                  {data?.use_farmout
                    ? `Farmout Company: ${data?.company_name}`
                    : `Driver: ${data?.firstname} ${data?.lastname}`}
                </TableCell>
                <TableCell width="50%" align="center">
                  {data?.use_farmout
                    ? "Vehicle: Farm-out"
                    : `Vehicle: ${data?.vehicle_name}`}
                </TableCell>
              </TableRow>
            </View>
            <TableRow>
              <TableCell width="50%" align="center">
                Service Type: {data?.service_code}
              </TableCell>
              <TableCell width="50%" align="center">
                Payment: {currencyFormatter.format(data?.payment)}
              </TableCell>
            </TableRow>
          </Table>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.header3}>
            <View
              style={{
                display: "grid",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Image src={PlaceIcon} style={styles.image2} />
              <Text style={[styles.text, { color: "blue" }]}>.</Text>
              <Text style={[styles.text, { color: "blue" }]}>.</Text>
              <Text style={[styles.text, { color: "blue" }]}>.</Text>
              <Image src={PlaceIcon} style={styles.image2} />
              {data?.return_location ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Image src={PlaceIcon} style={styles.image2} />
                </View>
              ) : null}
            </View>

            <View style={styles.innerBoard}>
              <View style={styles.innerBoard}>
                <Text style={styles.textBold}>From: {data?.from_location}</Text>
                <Text style={styles.text}>{data?.from_address}</Text>
                <Text style={styles.text}>
                  {data?.from_city}, {data?.from_state}
                </Text>
                <Text style={styles.text}>
                  Spot Time: {dayjs(data?.spot_time).format("HH:mm")}
                </Text>
                <Text style={styles.text}>
                  Start time: {dayjs(data?.start_time).format("HH:mm")}
                </Text>
              </View>

              <View style={styles.innerBoard}>
                <Text style={styles.textBold}>To: {data?.to_location}</Text>
                <Text style={styles.text}>{data?.to_address}</Text>
                <Text style={styles.text}>
                  {data?.to_city}, {data?.to_state}
                </Text>
                {data?.return_location ? (
                  <Text style={styles.text}>
                    Return time: {dayjs(data?.return_time).format("HH:mm")}
                  </Text>
                ) : null}
              </View>

              {data?.return_location ? (
                <View style={styles.innerBoard}>
                  <Text style={styles.textBold}>
                    End: {data?.return_location}
                  </Text>
                  <Text style={styles.text}>{data?.return_address}</Text>
                  <Text style={styles.text}>
                    {data?.return_city}, {data?.return_state}
                  </Text>
                  <Text style={styles.text}>
                    End time: {dayjs(data?.end_time).format("HH:mm")}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <Text style={[styles.textBold, { marginTop: 10 }]}>
            Instructions: {data?.instructions}
          </Text>

          <View style={styles.header2}>
            <Text style={styles.textBold}>PLEASE FUEL THE BUS</Text>
            <Text style={styles.textBold}>PARK THE CAR ON BUS SPOT</Text>
            <Text style={styles.textBold}>LOG IN SAMSARA</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX:
            407-517-4788
          </Text>
          <Text>contact@phoenixbusorlando.com - www.phoenixbusorlando.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default DriverReport;
