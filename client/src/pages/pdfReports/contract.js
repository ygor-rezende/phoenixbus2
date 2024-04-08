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
    marginTop: 10,
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
    textAlign: "center",
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

const Contract = (props) => {
  const {
    date,
    invoiceNum,
    client,
    category,
    passengers,
    services,
    details,
    locations,
    deposit,
  } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  //Exclude services that are Dead-Head
  const filteredServices = services.filter((e) => e.service_code !== "DH");

  //Total invoice
  let totalCharges = filteredServices?.reduce((sum, current) => {
    return sum + Number(current.gratuity) + current.charge * current.qty;
  }, 0);

  let totalTax = filteredServices
    ?.map((service) => {
      return {
        tax: service.sales_tax,
        charge: service.charge,
        qty: service.qty,
      };
    })
    ?.reduce((sum, service) => {
      return sum + Number(service.tax * service.charge * service.qty) / 100;
    }, 0);

  let credit = (totalCharges * deposit) / 100;
  let totalAmount = totalCharges - credit + totalTax;

  credit = currencyFormatter.format(credit);
  totalAmount = currencyFormatter.format(totalAmount);
  totalCharges = currencyFormatter.format(totalCharges);

  //Create a unique array with services and details
  //Return an array with an array of services and its details
  const allData = filteredServices?.map((service) => {
    let thisDetails = details
      ?.flat()
      .filter((detail) => detail.service_id === service.service_id);
    return [service, thisDetails];
  });

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Booking / Confirmation</Text>
            <View style={styles.text}>
              <Text>To: {client.agency}</Text>
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
            <Text
              style={styles.textBold}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
          <View style={styles.tableSection}>
            <Table>
              <TableHeader>
                <TableCell width="33%" align="left">
                  Category: {category}
                </TableCell>
                <TableCell width="33%" align="center">
                  Number of Seats: {passengers}
                </TableCell>
                <TableCell width="33%" align="right">
                  Invoice: {invoiceNum}
                </TableCell>
              </TableHeader>
            </Table>
          </View>
          <View style={styles.h2}>
            <Text>SERVICES</Text>
          </View>
          <View style={styles.tableSection}>
            <Table>
              <TableHeader>
                <TableCell width="15%" align="left">
                  Date
                </TableCell>
                <TableCell width="19%" align="left">
                  Service
                </TableCell>
                <TableCell width="17%" align="right">
                  No. Buses
                </TableCell>
                <TableCell width="17%" align="right">
                  Charge
                </TableCell>
                <TableCell width="17%" align="right">
                  Gratuity
                </TableCell>
                <TableCell width="17%" align="right">
                  SubTotal
                </TableCell>
              </TableHeader>
              {allData?.map((service) => (
                <View key={service[0]?.service_id}>
                  <View style={styles.serviceRow}>
                    <TableRow>
                      <TableCell width="15%" align="left">
                        {dayjs(service[0]?.service_date).format("MM/DD/YYYY")}
                      </TableCell>
                      <TableCell width="19%" align="left">
                        {service[0]?.service_name}
                      </TableCell>
                      <TableCell width="17%" align="right">
                        {service[0]?.qty}
                      </TableCell>
                      <TableCell width="17%" align="right">
                        {currencyFormatter.format(service[0]?.charge)}
                      </TableCell>
                      <TableCell width="17%" align="right">
                        {currencyFormatter.format(service[0]?.gratuity)}
                      </TableCell>
                      <TableCell width="17%" align="right">
                        {currencyFormatter.format(
                          service[0]?.charge * service[0]?.qty +
                            Number(service[0]?.gratuity)
                        )}
                      </TableCell>
                    </TableRow>
                  </View>
                  <View style={styles.detailsSection}>
                    {service[1]?.map((detail) => {
                      const fromLocation = locations?.find(
                        (e) => e.location_id === detail.from_location_id
                      );
                      const toLocation = locations?.find(
                        (e) => e.location_id === detail.to_location_id
                      );
                      const returnLocation = locations?.find(
                        (e) => e.location_id === detail.return_location_id
                      );
                      return (
                        <View key={detail.detail_id} style={styles.detailsRow}>
                          <TableRow>
                            {fromLocation && (
                              <TableCell
                                width={returnLocation ? "32%" : "49%"}
                                align="left"
                              >
                                <Text style={{ fontWeight: "semibold" }}>
                                  From: {fromLocation?.location_name}
                                </Text>
                              </TableCell>
                            )}
                            {toLocation && (
                              <TableCell
                                width={returnLocation ? "32%" : "49%"}
                                align="left"
                              >
                                <Text style={{ fontWeight: "semibold" }}>
                                  To: {toLocation?.location_name}
                                </Text>
                              </TableCell>
                            )}
                            {returnLocation && (
                              <TableCell width="32%" align="left">
                                <Text style={{ fontWeight: "semibold" }}>
                                  Return: {returnLocation?.location_name}
                                </Text>
                              </TableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            {fromLocation && (
                              <TableCell
                                width={returnLocation ? "32%" : "49%"}
                                align="left"
                              >
                                {fromLocation?.address}
                              </TableCell>
                            )}
                            {toLocation && (
                              <TableCell
                                width={returnLocation ? "32%" : "49%"}
                                align="left"
                              >
                                {toLocation?.address}
                              </TableCell>
                            )}
                            {returnLocation && (
                              <TableCell width="32%" align="left">
                                {returnLocation?.address}
                              </TableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            {fromLocation && (
                              <TableCell
                                width={returnLocation ? "32%" : "49%"}
                                align="left"
                              >
                                {fromLocation?.city},{" "}
                                {fromLocation.location_state} {fromLocation.zip}
                              </TableCell>
                            )}
                            {toLocation && (
                              <TableCell
                                width={returnLocation ? "32%" : "49%"}
                                align="left"
                              >
                                {toLocation?.city}, {toLocation.location_state}{" "}
                                {toLocation.zip}
                              </TableCell>
                            )}
                            {returnLocation && (
                              <TableCell width="32%" align="left">
                                {returnLocation?.city},{" "}
                                {returnLocation.location_state}{" "}
                                {returnLocation.zip}
                              </TableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <TableCell width="50%" align="left">
                              <Text style={{ fontWeight: "semibold" }}>
                                Spot time:{" "}
                                {dayjs(detail.spot_time).format("HH:mm")}
                              </Text>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell width="50%" align="left">
                              <Text style={{ fontWeight: "semibold" }}>
                                Start Time:{" "}
                                {dayjs(detail.start_time).format("HH:mm")}
                              </Text>
                            </TableCell>
                          </TableRow>

                          <View style={{ marginTop: 10, marginBottom: 5 }}>
                            <TableRow>
                              <TableCell width="100%" align="left">
                                <Text style={styles.textBold}>
                                  Instructions:
                                </Text>{" "}
                                {detail.instructions}
                              </TableCell>
                            </TableRow>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </Table>
          </View>
        </View>
        <View style={styles.totalsSection}>
          <Text style={{ fontSize: 14 }}>
            NOTE: Times in Military time (24-hour clock)
          </Text>
          <View style={[styles.textBold, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>Total Charges</Text>
            <Text>Total Payment/Credit</Text>
            <Text>Sales Tax:</Text>
            <Text>Total Amount Due</Text>
          </View>
          <View style={[styles.text, styles.innerBoard]}>
            <Text style={{ marginBottom: 10 }}>{totalCharges}</Text>
            <Text>({credit})</Text>
            <Text>
              {totalTax > 0 ? currencyFormatter.format(totalTax) : "Waived"}
            </Text>
            <Text style={styles.textBold}>{totalAmount}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX:
            407-517-4788
          </Text>
          <Text>contact@phoenixbusorlando.com - www.phoenixbusorlando.com</Text>
          <Text>Thank you for your business</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
      <Page style={styles.body}>
        <View style={styles.contentSection}>
          <Text style={[styles.textItalic, styles.h2, { margin: 10 }]}>
            TERMS AND CONDITIONS
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            A 10% NON REFUNDABLE DEPOSIT IS REQUIRED TO CONFIRM YOUR BOOKING.
            ALL BOOKINGS SHOULD BE PAID IN FULL 7 DAYS PRIOR TO THE FIRST
            SERVICE. A 90% REFUND WILL BE PROVIDED FOR BOOKINGS CANCELLED 7 DAYS
            PRIOR TO FIRST SERVICE. ALL CANCELLATIONS WITHIN 7 DAYS OF FIRST
            SERVICE WILL BE CHARGED THE FULL AMOUNT OF SERVICE.
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            PERSONAL BAGGAGE, INSTRUMENTS, EQUIPMENTS AND OTHER PROPERTIES WILL
            BE LIMITED TO THE CAPACITY OF THE VEHICLE. CARRIER ASSUMES NO
            RESPONSIBILITIES OR LIABILITIES FOR DAMAGED, STOLEN OR LOST ITEMS
            TRANSPORTED OR LEFT IN ITS VEHICLE.
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            RATES AND CHARGES ARE BASED ON THE INFORMATION PROVIDED. ALL RATES
            AND CHARGES ARE SUBJECT TO CHANGE BASED ON ACTUAL SERVICES RENDERED.
            IF DURING THE TRIP THE CHARTERING PARTY DESIRES TO CHANGE ROUTING OR
            SERVICES, ADDITIONAL CHARGES WILL BE ASSESSED AND COLLECTED, BASED
            ON AVAILABILITY AT TIME OF CHANGE.
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            CARRIER WILL NOT BE LIABLE FOR DELAYS CAUSED BY ACCIDENTS,
            BREAKDOWNS, BAD ROAD CONDITIONS, INCLEMENT WEATHER, AND OTHER
            CONDITIONS BEYOND ITS CONTROL. IF, IN THE OPINION OF THE CARRIER,
            CONDITIONS MAKE IT INADVISABLE TO OPERATE CHARTER SERVICE AT ANY
            POINT IN ROUTE, THE CARRIER RESERVES THE RIGHT TO DISCONTINUE
            SERVICE AND WILL NOT BE HELD LIABLE THEREFORE, OR BE CAUSED TO BE
            HELD FOR DAMAGE FOR ANY REASON WHATSOEVER. ADDITIONAL COSTS, SUCH AS
            MEALS, LODGING AND TRANSPORTATION WILL IN THIS RESPECT BECOME THE
            RESPONSIBILITY OF THE CHARTERING PARTY.
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            PHOENIX BUS INC, RESERVES ITS RIGHT TO LEASE EQUIPMENT FROM OTHER
            COMPANIES IN ORDER TO FULFILL THIS AGREEMENT. PHOENIX BUS INC,
            RESERVES THE RIGHT TO USE ASSIGNED MOTORCOACHES FOR MULTIPLE
            CHARTERS AND CUSTOMERS ON THE SAME DAY.
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            PHOENIX BUS INC, SHALL NOT BE LIABLE FOR LOSS OF TIME OR REVENUE DUE
            TO MECHANICAL FAILURE OR INCLEMENT WEATHER. EATING OR DRINKING IS
            NOT ALLOWED IN THE COACHES. PARKING IS THE RESPONSIBILITY OF THE
            CUSTOMER
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            CARRIER RESERVES THE RIGHT TO REFUSE TO TRANSPORT ANY PERSON OR
            PERSONS UNDER THE INFLUENCE OF ALCOHOL AND/OR DRUGS, OR WHOSE
            CONDUCT IS SUCH AS TO MAKE HIM/HER OBJECTIONABLE TO OTHER PASSENGER
            OR THE SAFE OPERATION OF THE VEHICLE.
          </Text>
          <Text style={[styles.text, styles.paragraph]}>
            DAMAGE TO SEATS, WINDOWS OR OTHER EQUIPMENT OR PART OF THE COACH,
            WHICH IS CAUSED BY ANY MEMBER OF THE CHARTERING PARTY, SHALL BE THE
            RESPONSIBILITY OF THE CHARTERING PARTY AND THE CHARTERING PARTY WILL
            PAY THE COST TO REPAIR AND LOSS OF SERVICE DUE TO SUCH DAMAGE.
          </Text>
        </View>
        <View style={styles.signatureSection}>
          <Text style={styles.signature}>
            Please sign, date and return ___________________________ Date:
            _____________
          </Text>
          <Text style={[styles.signature, styles.text]}>
            Thank you: TO CONFIRM PLEASE EMAIL BACK SIGNED CONTRACT THEN EMAIL
            BACK AUTHORIZATION FORM OR/AND PAY ONLINE - CONTACT US IF THERE IS
            ANY QUESTIONS.
          </Text>
        </View>
        <View style={styles.footer} fixed>
          <Text>
            3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX:
            407-517-4788
          </Text>
          <Text>contact@phoenixbusorlando.com - www.phoenixbusorlando.com</Text>
          <Text>Thank you for your business</Text>
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

export default Contract;
