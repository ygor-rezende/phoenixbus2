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
    marginBottom: 15,
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15,
  },
  imageSmall: {
    marginHorizontal: 10,
    width: "80px",
    marginVertical: 15,
    position: "absolute",
    top: 25,
    right: 25,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactBoard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    border: 1,
    padding: 5,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 10,
  },
  textCenter: {
    fontFamily: "Roboto",
    fontSize: 9,
    textAlign: "center",
    color: "#52595D",
    marginBottom: 5,
  },
  textJustify: {
    fontFamily: "Roboto",
    fontSize: 10,
    textAlign: "justify",
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
    marginBottom: 10,
  },
  h3: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  h4: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  terms: {
    marginTop: 20,
  },
  innerBoard: {
    marginLeft: 10,
    marginTop: 10,
  },

  bulletPoints: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 7,
  },
  contentSection: {
    marginTop: 20,
    marginBottom: 10,
    borderTop: 1,
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

const QuoteReport = (props) => {
  const {
    date,
    invoiceNum,
    quotedCost,
    salesPerson,
    client,
    passengers,
    deposit,
    tripStart,
    tripEnd,
    quoteExp,
  } = props;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  //Deposit
  let depositCost = (quotedCost * deposit) / 100;
  //Cost divided by passengers
  let dividedCost = quotedCost / passengers;

  depositCost = currencyFormatter.format(depositCost);
  dividedCost = currencyFormatter.format(dividedCost);

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Quote</Text>
            <View style={styles.text}>
              <Text>Reference #: {invoiceNum}</Text>
              <Text>Sales Representative: {salesPerson}</Text>
              <Text>Quote Date: {date}</Text>
            </View>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.innerBoard}>
            <Text style={styles.textBold}>Dear Mr./Ms. {client.contact},</Text>
            <Text style={styles.textItalic}>
              Greetings from Phoenix Bus, Inc.!
            </Text>
            <Text style={styles.textItalic}>
              It will be our honor to assist you and your group with your
              transportation needs. Based on your email/phone call, your trip
              details and itinerary are currently as follows:
            </Text>
          </View>
          <View style={styles.contactBoard}>
            <View style={styles.text}>
              <Text>Email: {client.email}</Text>
              <Text>Phone: {client.phone}</Text>
              <Text style={[styles.textBold, { marginTop: 10 }]}>
                *Quote may be subject to change after {quoteExp} hrs
              </Text>
            </View>
            <View style={styles.text}>
              <Text>From: {tripStart}</Text>
              <Text>Through: {tripEnd}</Text>
            </View>
          </View>
          <View style={styles.innerBoard}>
            <Text style={styles.textJustify}>
              We make sure that all of your transportation needs are pre-planned
              with meticulous care so that we can provide you with fast and
              convenient service. Our executive fleet vehicles are pristine and
              come with with full air conditioning, and a uniformed chauffer.
              All of our chauffeurs are drug tested, DOT licensed, certified by
              Jessica Lunsford Law, and wear professional attire. With
              monitoring all flight arrivals, we provide professional, prompt,
              courteous, and safe transportation service.
            </Text>
          </View>
          <View style={styles.innerBoard}>
            <View style={styles.bulletPoints}>
              <Text style={styles.textBold}>{"\u2022"}</Text>
              <Text style={[{ marginLeft: 10 }, styles.textItalic]}>
                The all-inclusive grand total for your reservation would be{" "}
              </Text>
              <Text style={styles.textBold}>
                {currencyFormatter.format(quotedCost)}
              </Text>
            </View>
            <View style={styles.bulletPoints}>
              <Text style={styles.textBold}>{"\u2022"}</Text>
              <Text style={[{ marginLeft: 10 }, styles.textItalic]}>
                If divided by the the {passengers} passengers, the cost per
                person would only be{" "}
              </Text>
              <Text style={styles.textBold}>{dividedCost}</Text>
            </View>
            <View style={styles.bulletPoints}>
              <Text style={styles.textBold}>{"\u2022"}</Text>
              <Text style={[{ marginLeft: 10 }, styles.textItalic]}>
                All we need to reserve this booking is a deposit of {deposit}%
                or {depositCost} and we’ll send you booking confirmation! (if
                you are a public school no deposit is required)
              </Text>
            </View>
            <View style={styles.bulletPoints}>
              <Text style={styles.textBold}>{"\u2022"}</Text>
              <Text style={[{ marginLeft: 10 }, styles.textItalic]}>
                Sales Tax waived! Above industry standard $7 million insurance
                policy!
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20, borderBottom: 1 }}>
            <Text style={styles.h2}>AMENITIES</Text>
            <Text style={styles.textCenter}>
              Prevost/Volvo/Temsa/MCI/Van Hool/Setra Mercedes Motor coach which
              allows 45-59-53-55-57 pax or Mini Coach Bus 18-24-28-33-39 pax or
              Van for 14 pax
            </Text>
            <Text style={styles.textCenter}>
              Wireless internet (extra) AM/FM REI Video system w/5 TV's with
              DVD/VCD/CD/MP3/MP4 player
            </Text>
            <Text style={styles.textCenter}>
              PA System/Passenger pull-down shades/Passenger seat grab
              handles/Passenger seat footrests/Restroom/Reclining Seats/Shaded
              Windows
            </Text>
          </View>
          <View style={styles.innerBoard}>
            <Text style={styles.textItalic}>
              We take pride in being registered and affiliated with several
              recognized organizations including the Florida School Counties,
              Orlando Theme Parks, Orlando Magic Authorized Ticket Reseller and
              Experience Kissimmee.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            5387 L.B. MCLEOD RD * ORLANDO * FL * 32811 * PH: 888-755-5398 * FAX:
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
        <Image style={styles.imageSmall} src={PhoenixLogo} />

        <Text style={styles.h3}>THANK YOU AND HAVE A GREAT DAY!</Text>

        <View>
          <Text style={styles.h4}>Included in the Quote</Text>
          <Text style={styles.textCenter}>
            THIS QUOTE IS ONLY VALID AFTER IS APPROVED BY PHOENIX BUS, INC AND
            THE CLIENT.
          </Text>
          <Text style={styles.textCenter}>
            FUEL AND ANY FUEL SURCHAGE •• ANY DEADHEAD MILES •• LUGGAGE STORAGE
          </Text>
          <Text style={styles.textCenter}>
            FULLY EQUIPPED ONBOARD RESTROOM • • BASIC BUS CLEANING
          </Text>
          <Text style={styles.textCenter}>
            ANY RELAY DRIVER •• WIFI DEVICE (Free of Charge)
          </Text>
          <View style={styles.terms}>
            <Text style={[styles.textBold, { marginBottom: 10 }]}>
              PAYMENT AND DEPOSIT TERMS
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              A NON REFUNDABLE DEPOSIT MAY BE REQUIRED TO CONFIRM YOUR BOOKING
              (SEE QUOTE). ALL BOOKINGS SHOULD BE PAID IN FULL 7 DAYS PRIOR TO
              THE FIRST SERVICE. A 90% REFUND WILL BE PROVIDED FOR BOOKINGS
              CANCELLED 7 DAYS PRIOR TO FIRST SERVICE. ALL CANCELLATIONS WITHIN
              7 DAYS OF FIRST SERVICE WILL BE CHARGED THE FULL AMOUNT OF
              SERVICE.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              EACH DRIVER IS ALLOWED UP TO 10 HRS OF NONCONSECUTIVE DRIVE TIME
              AND 15 HRS OF WORK TIME EACH DAY AS PER DOT (DEPARTMENT OF
              TRANSPORTATION) REGULATIONS. TIPPING IS APPRECIATED AND IS AT YOUR
              DISCRETION. CUSTOMARY AMOUNTS ARE 7, 12, OR 18% OF THE TOTAL COST.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              PERSONAL BAGGAGE, INSTRUMENTS, EQUIPMENTS AND OTHER PROPERTIES
              WILL BE LIMITED TO THE CAPACITY OF THE VEHICLE. CARRIER ASSUMES NO
              RESPONSIBILITIES OR LIABILITIES FOR DAMAGED, STOLEN OR LOST ITEMS
              TRANSPORTED OR LEFT IN ITS VEHICLE.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              RATES AND CHARGES ARE BASED ON THE INFORMATION PROVIDED. ALL RATES
              AND CHARGES ARE SUBJECT TO CHANGE BASED ON ACTUAL SERVICES
              RENDERED. IF DURING THE TRIP THE CHARTERING PARTY DESIRES TO
              CHANGE ROUTING OR SERVICES, ADDITIONAL CHARGES WILL BE ASSESSED
              AND COLLECTED, BASED ON AVAILABILITY AT TIME OF CHANGE.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              CARRIER WILL NOT BE LIABLE FOR DELAYS CAUSED BY ACCIDENTS,
              BREAKDOWNS, BAD ROAD CONDITIONS, INCLEMENT WEATHER, AND OTHER
              CONDITIONS BEYOND ITS CONTROL. IF, IN THE OPINION OF THE CARRIER,
              CONDITIONS MAKE IT INADVISABLE TO OPERATE CHARTER SERVICE AT ANY
              POINT IN ROUTE, THE CARRIER RESERVES THE RIGHT TO DISCONTINUE
              SERVICE AND WILL NOT BE HELD LIABLE THEREFORE, OR BE CAUSED TO BE
              HELD FOR DAMAGE FOR ANY REASON WHATSOEVER. ADDITIONAL COSTS, SUCH
              AS MEALS, LODGING AND TRANSPORTATION WILL IN THIS RESPECT BECOME
              THE RESPONSIBILITY OF THE CHARTERING PARTY.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              PHOENIX BUS INC, RESERVES ITS RIGHT TO LEASE EQUIPMENT FROM OTHER
              COMPANIES IN ORDER TO FULFILL THIS AGREEMENT. PHOENIX BUS INC,
              RESERVES THE RIGHT TO USE ASSIGNED MOTORCOACHES FOR MULTIPLE
              CHARTERS AND CUSTOMERS ON THE SAME DAY.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              PHOENIX BUS INC, SHALL NOT BE LIABLE FOR LOSS OF TIME OR REVENUE
              DUE TO MECHANICAL FAILURE OR INCLEMENT WEATHER. EATING OR DRINKING
              IS NOT ALLOWED IN THE COACHES. PARKING IS THE RESPONSIBILITY OF
              THE CUSTOMER
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              CARRIER RESERVES THE RIGHT TO REFUSE TO TRANSPORT ANY PERSON OR
              PERSONS UNDER THE INFLUENCE OF ALCOHOL AND/OR DRUGS, OR WHOSE
              CONDUCT IS SUCH AS TO MAKE HIM/HER OBJECTIONABLE TO OTHER
              PASSENGER OR THE SAFE OPERATION OF THE VEHICLE.
            </Text>
            <Text style={[styles.text, styles.paragraph]}>
              DAMAGE TO SEATS, WINDOWS OR OTHER EQUIPMENT OR PART OF THE COACH,
              WHICH IS CAUSED BY ANY MEMBER OF THE CHARTERING PARTY, SHALL BE
              THE RESPONSIBILITY OF THE CHARTERING PARTY AND THE CHARTERING
              PARTY WILL PAY THE COST TO REPAIR AND LOSS OF SERVICE DUE TO SUCH
              DAMAGE.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            5387 L.B. MCLEOD RD * ORLANDO * FL * 32811 * PH: 888-755-5398 * FAX:
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

export default QuoteReport;
