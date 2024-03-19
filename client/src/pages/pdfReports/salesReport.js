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
import Roboto from "../../fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "../../fonts/Roboto/Roboto-Bold.ttf";
import RobotoItalic from "../../fonts/Roboto/Roboto-Italic.ttf";
import { Table, TableCell, TableHeader, TableRow } from "./Table";

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
    width: "170px",
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

const SalesReport = (props) => {
  const { data, startDate, endDate } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const percentFormater = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  //sum all sales up
  let totalSales = data.reduce((sum, cur) => {
    return sum + Number(cur.total_sales);
  }, 0);

  //calculate the percentual of sales for each client and add it to data
  let sales = data.map((e) => {
    return {
      agency: e.agency,
      total: e.total_sales,
      percent: e.total_sales / totalSales,
    };
  });

  totalSales = currencyFormatter.format(totalSales);

  //get total farmout
  let totalFarmout = currencyFormatter.format(data[0]?.total_farmout);

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Total Sales By Client</Text>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>
        <Text style={styles.h2}>
          FROM {startDate} TO {endDate}
        </Text>

        <View style={styles.tableSection}>
          <Table>
            <TableHeader>
              <TableCell width="40%" align="left">
                Agency
              </TableCell>
              <TableCell width="30%" align="right">
                Total Sales
              </TableCell>
              <TableCell width="30%" align="right">
                Sales%
              </TableCell>
            </TableHeader>
            <View style={{ marginTop: 10 }}>
              {sales?.map((row) => {
                return (
                  <TableRow key={row.vehicle_id}>
                    <TableCell width="40%" align="left">
                      {row?.agency}
                    </TableCell>
                    <TableCell width="30%" align="right">
                      {currencyFormatter.format(row?.total)}
                    </TableCell>
                    <TableCell width="30%" align="right">
                      {percentFormater.format(row?.percent)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </View>
          </Table>
        </View>

        <View style={styles.totalsSection}>
          <Text style={{ fontSize: 16, marginTop: 10 }}>
            Summary for the period
          </Text>
          <View style={[styles.textBold, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>Total Sales</Text>
            <Text>Total Farmout</Text>
          </View>
          <View style={[styles.text, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>{totalSales}</Text>
            <Text>{totalFarmout}</Text>
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

export default SalesReport;
