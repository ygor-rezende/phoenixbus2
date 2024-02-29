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
    fontSize: 11,
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
    borderTop: 1,
  },
  tableSection: {
    borderTop: 1,
    marginBottom: 20,
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

const Contract = (props) => {
  const {
    date,
    invoiceNum,
    client,
    passengers,
    bookingDate,
    arrival,
    departure,
    services,
  } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  //Total invoice
  let totalCharges = services?.reduce((sum, current) => {
    return sum + Number(current.gratuity) + current.charge * current.qty;
  }, 0);

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Booking / Invoice</Text>
            <View style={styles.text}>
              <Text>To: {client.agency}</Text>
              <Text>Account #: {client.client_id?.substring(0, 8)}</Text>
              <Text>Attn: {client.contact}</Text>
              <Text>{client.address1}</Text>
              <Text>
                {client.city}, {client.zip} {client.client_state}
              </Text>
              <Text>Phone: {client.phone}</Text>
              <Text>Email: {client.email}</Text>
            </View>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>

        <View style={styles.contentSection}>
          <View style={[styles.textItalic, styles.innerBoard]}>
            <Text>Dear Client:</Text>
            <Text>
              Thank you for choosing us to provide you with your transportation
              needs. We pride ourselves in having the finest motorcoach service
              available. In order to ensure that you receive the best possible
              service, we ask you to review the information below, sign and fax
              back to us at 407-517-4788.
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={styles.textBold}>{date}</Text>
            <Text style={styles.textItalic}>PHOENIX BUS INC</Text>
            <Text style={styles.textBold}>Page 1 of 1</Text>
          </View>
          <View style={styles.tableSection}></View>
        </View>
        <View style={styles.signatureSection}>
          <Text style={styles.signature}>
            Please sign, date and return ___________________________ Date:
            _____________
          </Text>
          <Text style={styles.signature}>
            Thank you: TO CONFIRM PLEASE EMAIL BACK SIGNED CONTRACT THEN EMAIL
            BACK AUTHORIZATION FORM OR/AND PAY ONLINE - CONTACT US IF THERE IS
            ANY QUESTIONS.
          </Text>
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

export default Contract;
