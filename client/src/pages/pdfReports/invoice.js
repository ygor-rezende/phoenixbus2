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
import dayjs from "dayjs";

import PhoenixLogo from "../../images/phoenix_logo.png";
import Roboto from "../../fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "../../fonts/Roboto/Roboto-Bold.ttf";

import { Table, TableRow, TableCell, TableHeader } from "./Table";

Font.register({
  family: "Roboto",
  fonts: [{ src: Roboto }, { src: RobotoBold, fontWeight: 700 }],
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
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 12,
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: 700,
  },
  h2: {
    fontSize: 18,
  },
  tripBoard: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    border: 2,
  },
  innerBoard: {
    margin: 10,
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 30,
    borderTop: 1,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  tableSection: {
    borderTop: 1,
    marginTop: 30,
    marginBottom: 20,
  },

  infoSection: {
    margin: 10,
    border: 2,
    padding: 10,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontSize: "10",
  },
});

const Invoice = (props) => {
  const {
    date,
    invoiceNum,
    client,
    passengers,
    bookingDate,
    arrival,
    departure,
    services,
    deposit,
  } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  //Total invoice
  let totalInvoice = services?.reduce((sum, current) => {
    return sum + Number(current.gratuity) + current.charge * current.qty;
  }, 0);

  let credit = (totalInvoice * deposit) / 100;
  let totalAmount = totalInvoice - credit;

  credit = currencyFormatter.format(credit);
  totalAmount = currencyFormatter.format(totalAmount);
  totalInvoice = currencyFormatter.format(totalInvoice);

  return (
    <Document>
      <Page style={styles.body} size={"LETTER"}>
        <View style={styles.header}>
          <Image style={styles.image} src={PhoenixLogo} />
          <View>
            <Text style={styles.title}>Invoice / Receipt</Text>
            <Text style={styles.textBold}>Date: {date}</Text>
            <Text style={styles.textBold}>Invoice #: {invoiceNum}</Text>
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.text}>
            <Text>To: {client.agency}</Text>
            <Text>Account #: {client.client_id?.substring(0, 8)}</Text>
            <Text>Attn: {client.contact}</Text>
            <Text>{client.address1}</Text>
            <Text>
              {client.city}, {client.client_state}
            </Text>
            <Text>Phone: {client.phone}</Text>
            <Text>Email: {client.email}</Text>
          </View>
          <View style={styles.tripBoard}>
            <View style={[styles.textBold, styles.innerBoard]}>
              <Text>Passengers:</Text>
              <Text>Booking date:</Text>
              <Text>Arrival:</Text>
              <Text>Departure:</Text>
            </View>
            <View style={[styles.text, styles.innerBoard]}>
              <Text>{passengers}</Text>
              <Text>{bookingDate}</Text>
              <Text>{arrival}</Text>
              <Text>{departure}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tableSection}>
          <Table>
            <TableHeader>
              <TableCell>Date</TableCell>
              <TableCell>Service</TableCell>
              <TableCell align="right">Charge</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Gratuity</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableHeader>
            {services?.map((service) => (
              <TableRow>
                <TableCell>
                  {dayjs(service.service_date).format("MM/DD/YYYY")}
                </TableCell>
                <TableCell>{service.service_name}</TableCell>
                <TableCell align="right">
                  {currencyFormatter.format(service.charge)}
                </TableCell>
                <TableCell align="right">{service.qty}</TableCell>
                <TableCell align="right">{service.gratuity}</TableCell>
                <TableCell align="right">
                  {currencyFormatter.format(
                    service.charge * service.qty + Number(service.gratuity)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </View>
        <View style={styles.totalsSection}>
          <View style={[styles.textBold, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>Total Invoice</Text>
            <Text>Total Payment/Credit</Text>
            <Text>Total Amount Due</Text>
          </View>
          <View style={[styles.text, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>{totalInvoice}</Text>
            <Text>{credit}</Text>
            <Text>{totalAmount}</Text>
          </View>
        </View>

        <View style={[styles.infoSection, styles.text]}>
          <Text style={{ marginBottom: 10 }}>5 CONVENIENT WAYS TO PAY</Text>
          <Text>1) CHECK, CASHIERS CHECK OR MONEY ORDER</Text>
          <Text>2) BANK TRANSFER (ASK US FOR WIRE INFO)</Text>
          <Text>3) CREDIT CARD VIA FORM(4% FEE) OR GO TO OUR WEBSITE</Text>
          <Text>
            4) ZELLE QUICK PAY APPLICATION (USE CONTACT@PHOENIXBUSORLANDO.COM)
          </Text>
          <Text>5) VIA PURCHASE ORDER</Text>
        </View>
        <View style={styles.footer}>
          <Text>
            5387 L.B. MCLEOD RD * ORLANDO * FL * 32811 * PH: 888-755-5398 * FAX:
            407-517-4788
          </Text>
          <Text>contact@phoenixbusorlando.com - www.phoenixbusorlando.com</Text>
          <Text>Thanks for your business</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
