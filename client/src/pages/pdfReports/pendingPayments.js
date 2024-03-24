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

const PendingPaymentsReport = (props) => {
  const { data, date } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const cliData = data?.map((e) => {
    return {
      clientId: e.client_id,
      agency: e.agency,
      balance: e.balance,
      received: e.received,
    };
  });

  const uniqueClients = [
    ...new Map(cliData.map((e) => [e.clientId, e])).values(),
  ];

  //sum all sales up
  let totalSales = data.reduce((sum, cur) => {
    return sum + Number(cur.cost);
  }, 0);

  let totalReceived = uniqueClients.reduce((sum, cur) => {
    return sum + Number(cur.received);
  }, 0);

  let totalBalance = uniqueClients.reduce((sum, cur) => {
    return sum + Number(cur.balance);
  }, 0);

  //calculate the percentual of sales for each client and add it to data

  totalSales = currencyFormatter.format(totalSales);
  totalReceived = currencyFormatter.format(totalReceived);
  totalBalance = currencyFormatter.format(totalBalance);

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Pending Invoices</Text>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>
        <Text style={styles.h2}>{date}</Text>

        <View style={styles.tableSection}>
          <Table>
            <TableHeader>
              <TableCell width="29%" align="left">
                Agency
              </TableCell>
              <TableCell width="15%" align="left">
                Invoice
              </TableCell>
              <TableCell width="10%" align="left">
                Date
              </TableCell>
              <TableCell width="10%" align="right">
                Age
              </TableCell>
              <TableCell width="12%" align="right">
                Amount
              </TableCell>
              <TableCell width="12%" align="right">
                Received
              </TableCell>
              <TableCell width="12%" align="right">
                Balance
              </TableCell>
            </TableHeader>
            <View>
              {uniqueClients?.map((row) => {
                const services = data?.filter(
                  (e) => e.client_id === row.clientId
                );
                return (
                  <View>
                    <View style={{ borderBottom: 0.5, marginTop: 10 }}>
                      <TableRow key={row.clientId}>
                        <TableCell width="76%" align="left">
                          {row?.agency}
                        </TableCell>
                        <TableCell width="12%" align="right">
                          {currencyFormatter.format(row?.received)}
                        </TableCell>
                        <TableCell width="12%" align="right">
                          {currencyFormatter.format(row?.balance)}
                        </TableCell>
                      </TableRow>
                    </View>
                    <View>
                      {services?.map((serv, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell width="29%" align="left">
                              {serv.service_name}
                            </TableCell>
                            <TableCell width="15%" align="left">
                              {serv.invoice}
                            </TableCell>
                            <TableCell width="10%" align="left">
                              {dayjs(serv.service_date).format("l")}
                            </TableCell>
                            <TableCell width="10%" align="right">
                              {dayjs(new Date()).diff(
                                serv.service_date,
                                "days"
                              )}
                            </TableCell>
                            <TableCell width="12%" align="right">
                              {currencyFormatter.format(serv.cost)}
                            </TableCell>
                            <TableCell width="12%" align="right"></TableCell>
                            <TableCell width="12%" align="right"></TableCell>
                          </TableRow>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </Table>
        </View>

        <View style={styles.totalsSection}>
          <Text style={{ fontSize: 16, marginTop: 10 }}>Summary</Text>
          <View style={[styles.textBold, styles.innerBoard]}>
            <Text>Total Sales</Text>
            <Text>Total Received</Text>
            <Text>Total Balance</Text>
          </View>
          <View style={[styles.text, styles.innerBoard]}>
            <Text>{totalSales}</Text>
            <Text>{totalReceived}</Text>
            <Text>{totalBalance}</Text>
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

export default PendingPaymentsReport;
