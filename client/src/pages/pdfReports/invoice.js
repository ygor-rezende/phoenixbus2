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
    fontSize: 14,
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 14,
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
  contentSection: {
    marginTop: 20,
    paddingTop: 30,
    borderTop: 1,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  signatureSection: {
    marginTop: 30,
    fontSize: 12,
    marginBottom: 30,
  },
  signature: {
    textAlign: "center",
    borderTop: 1,
    marginTop: 40,
    marginHorizontal: 80,
    paddingTop: 10,
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
    destination,
    account,
    responsible,
    address,
    city,
    state,
    phone,
    email,
    group,
    passengers,
    bookingDate,
    arrival,
    departure,
    reference,
    payment,
    charges,
    tax,
  } = props;
  const total = payment + charges + tax;
  return (
    <Document>
      <Page style={styles.body}>
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
            <Text>To: {destination}</Text>
            <Text>Account: {account}</Text>
            <Text>Attn: {responsible}</Text>
            <Text>{address}</Text>
            <Text>
              {city}, {state}
            </Text>
            <Text>Phone: {phone}</Text>
            <Text>Email: {email}</Text>
          </View>
          <View style={styles.tripBoard}>
            <View style={[styles.textBold, styles.innerBoard]}>
              <Text>Group:</Text>
              <Text>Passengers:</Text>
              <Text>Booking date:</Text>
              <Text>Arrival:</Text>
              <Text>Departure:</Text>
              <Text>Reference:</Text>
            </View>
            <View style={[styles.text, styles.innerBoard]}>
              <Text>{group}</Text>
              <Text>{passengers}</Text>
              <Text>{bookingDate}</Text>
              <Text>{arrival}</Text>
              <Text>{departure}</Text>
              <Text>{reference}</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentSection}>
          <View style={[styles.textBold, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>Total Invoice</Text>
            <Text>Total Payment/Credit</Text>
            <Text>Other Charges/Refund</Text>
            <Text>Sales Tax Waived</Text>
            <p></p>
            <Text>Total Amount Due</Text>
          </View>
          <View style={[styles.text, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>${total}</Text>
            <Text>${payment}</Text>
            <Text>${charges}</Text>
            <Text>${tax}</Text>
            <Text>${total}</Text>
          </View>
        </View>
        <View style={styles.signatureSection}>
          <Text>
            By signing below, I hereby acknowledge that I have completely read
            and fully understand this invoice information contents.
          </Text>
          <Text style={styles.signature}>Client Signature</Text>
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
