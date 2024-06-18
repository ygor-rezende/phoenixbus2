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

const PendingFarmoutPayReport = (props) => {
  const { data, date } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  //calculate amount due and past due by company
  let newData = data?.map((e, idx, arr) => {
    let dataByCompany = arr.filter(
      (item) => (item.company_id === e.company_id) & (item.amount_due > 0)
    );
    let sumPastDue = dataByCompany?.reduce((sum, cur) => {
      return sum + Number(cur.past_due);
    }, 0);
    let totalAmountDue = sumPastDue - e.total_payments;
    let totalPayments = dataByCompany?.reduce((sum, cur) => {
      return sum + Number(cur.paid);
    }, 0);
    return {
      company_id: e.company_id,
      company_name: e.company_name,
      invoice: e.invoice,
      trip_start_date: e.trip_start_date,
      past_due: e.past_due,
      sum_past_due: sumPastDue,
      total_payments: totalPayments,
      total_amount_due: totalAmountDue,
      amount_due: e.amount_due,
      paid: e.paid,
    };
  });

  //get unique companies data
  let uniqueData = [...new Map(newData.map((e) => [e.company_id, e])).values()];

  //sum all past due payments
  let totalPastDue = uniqueData.reduce((sum, cur) => {
    return sum + Number(cur.sum_past_due);
  }, 0);

  let totalPaid = uniqueData.reduce((sum, cur) => {
    return sum + Number(cur.total_payments);
  }, 0);

  let totalBalance = totalPastDue - totalPaid;

  //calculate the percentual of sales for each client and add it to data

  totalPastDue = currencyFormatter.format(totalPastDue);
  totalPaid = currencyFormatter.format(totalPaid);
  totalBalance = currencyFormatter.format(totalBalance);

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Pending FarmOut Payments</Text>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>
        <Text style={styles.h2}>{date}</Text>

        <View style={styles.tableSection}>
          <Table>
            <TableHeader>
              <TableCell width="44%" align="left">
                Company
              </TableCell>
              <TableCell width="10%" align="left">
                Date
              </TableCell>
              <TableCell width="10%" align="right">
                Age
              </TableCell>
              <TableCell width="12%" align="right">
                Past Due
              </TableCell>
              <TableCell width="12%" align="right">
                Paid
              </TableCell>
              <TableCell width="12%" align="right">
                Amount Due
              </TableCell>
            </TableHeader>
            <View>
              {uniqueData?.map((row, index) => {
                const details = newData?.filter(
                  (e) => e.company_id === row.company_id && e.amount_due > 0
                );
                return (
                  <View>
                    <View
                      style={[
                        { borderBottom: 0.5, marginTop: 10 },
                        styles.textBold,
                      ]}
                    >
                      <TableRow key={row.company_id} bgColor="#dcdcdc">
                        <TableCell width="64%" align="left">
                          {row?.company_name}
                        </TableCell>
                        <TableCell width="12%" align="right">
                          {currencyFormatter.format(row?.sum_past_due)}
                        </TableCell>
                        <TableCell width="12%" align="right">
                          {currencyFormatter.format(row?.total_payments)}
                        </TableCell>
                        <TableCell width="12%" align="right">
                          {currencyFormatter.format(
                            row?.sum_past_due - row?.total_payments
                          )}
                        </TableCell>
                      </TableRow>
                    </View>
                    <View>
                      {details?.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell width="44%" align="left">
                              {item.invoice}
                            </TableCell>
                            <TableCell width="10%" align="left">
                              {dayjs(item.trip_start_date).format("l")}
                            </TableCell>
                            <TableCell width="10%" align="right">
                              {dayjs(new Date()).diff(
                                item.trip_start_date,
                                "days"
                              )}
                            </TableCell>
                            <TableCell width="12%" align="right">
                              {currencyFormatter.format(item.past_due)}
                            </TableCell>
                            <TableCell width="12%" align="right">
                              {currencyFormatter.format(item.paid)}
                            </TableCell>
                            <TableCell width="12%" align="right">
                              {currencyFormatter.format(item.amount_due)}
                            </TableCell>
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
            <Text>Total Past Due</Text>
            <Text>Total Paid</Text>
            <Text>Total Balance</Text>
          </View>
          <View style={[styles.text, styles.innerBoard]}>
            <Text>{totalPastDue}</Text>
            <Text>{totalPaid}</Text>
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

export default PendingFarmoutPayReport;
