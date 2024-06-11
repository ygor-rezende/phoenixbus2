const React = require("react");
const {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
} = require("@react-pdf/renderer");
const fs = require("fs");
const path = require("path");
const PhoenixLogo = fs.readFileSync(
  path.join(__dirname, "../images/phoenix_logo.png")
);
const PlaceIcon = fs.readFileSync(
  path.join(__dirname, "../images/Location-Icon-1.png")
);
const Roboto =
  "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf";
const RobotoBold =
  "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf";
const RobotoItalic =
  "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf";
const { Table, TableCell, TableHeader, TableRow } = require("./Table");

const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));
dayjs.tz.setDefault("America/New_York");

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
    marginBottom: 10,
    alignItems: "baseline",
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
    alignItems: "baseline",
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

  const serviceTypes = [
    { type: "RT", name: "ROUND-TRIP" },
    { type: "CH", name: "CHARTER" },
    { type: "OW", name: "ONE-WAY" },
    { type: "DH", name: "DEAD-HEAD" },
    { type: "SH", name: "SHUTTLE" },
  ];

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  }

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Driver Order</Text>
          </View>
          <Image style={styles.image} src={PhoenixLogo} />
        </View>
        <Text style={styles.h2}>
          {dayjs.tz(data?.service_date).format("dddd, MMMM D, YYYY")}
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
              <TableCell width="50%" align="left">
                <Text style={{ fontWeight: 100 }}>
                  Contact: {data?.contact} {formatPhoneNumber(data?.phone)}
                </Text>
              </TableCell>
            </TableHeader>
            <View style={{ marginTop: 10, marginLeft: 80 }}>
              <TableRow>
                <TableCell width="50%" align="left">
                  {data?.use_farmout
                    ? `Farmout Company: ${data?.company_name}`
                    : `Driver: ${data?.firstname} ${data?.lastname}`}
                </TableCell>
                <TableCell width="50%" align="left">
                  Service Type:{" "}
                  {serviceTypes.find((e) => e.type === data?.service_code)
                    ?.name || data?.service_code}
                </TableCell>
              </TableRow>
            </View>
            <View style={{ marginLeft: 80 }}>
              <TableRow>
                <TableCell width="50%" align="left">
                  Payment: {currencyFormatter.format(data?.payment)}
                </TableCell>
                <TableCell width="50%" align="left">
                  {data?.use_farmout
                    ? "Vehicle: Farm-out"
                    : `Vehicle # ${data?.vehicle_name}`}
                </TableCell>
              </TableRow>
            </View>
            <View style={{ marginLeft: 80 }}>
              <TableRow>
                <TableCell width="50%" align="left">
                  Invoice: {data?.invoice}
                </TableCell>
              </TableRow>
            </View>
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
              <Text style={[styles.text, { color: "blue" }]}>.</Text>
              {data?.additional_stop_detail === "OutWard" ||
              data?.additional_stop_detail === "Both" ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                </View>
              ) : null}
              <Image src={PlaceIcon} style={styles.image2} />
              {data?.additional_stop_detail === "Both" ||
              data?.additional_stop_detail === "Return" ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                </View>
              ) : null}
              {data?.return_location ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Text style={[styles.text, { color: "blue" }]}>.</Text>
                  <Image src={PlaceIcon} style={styles.image2} />
                </View>
              ) : null}
            </View>

            <View style={styles.innerBoard}>
              <View style={styles.header}>
                <View style={{ width: "17%" }}>
                  <Text style={styles.text}>
                    <Text style={styles.textBold}>Yard: </Text>
                    {data?.spot_time
                      ? dayjs.tz(data?.spot_time).format("HH:mm")
                      : ""}
                  </Text>
                  {data?.spot_time && (
                    <Text style={styles.text}>
                      {dayjs.tz(data?.spot_time).get("hour") < 12
                        ? "(morning)"
                        : ""}
                    </Text>
                  )}
                  <Text style={styles.text}>
                    <Text style={styles.textBold}>Spot: </Text>
                    {data?.start_time
                      ? dayjs
                          .tz(data?.start_time)
                          .subtract(15, "m")
                          .format("HH:mm")
                      : ""}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.textBold}>Start: </Text>
                    {data?.start_time
                      ? dayjs.tz(data?.start_time).format("HH:mm")
                      : ""}
                  </Text>
                </View>
                <View style={{ width: "75%" }}>
                  <Text style={styles.text}>
                    PICK UP LOCATION:{" "}
                    <Text style={styles.textBold}>{data?.from_location}</Text>
                  </Text>
                  <Text style={[styles.text, { marginLeft: 90 }]}>
                    {data?.from_address}
                  </Text>
                  <Text style={[styles.text, { marginLeft: 90 }]}>
                    {data?.from_city}, {data?.from_state}
                  </Text>
                </View>
              </View>

              {(data?.additional_stop_detail === "Both" ||
                data?.additional_stop_detail === "OutWard") && (
                <View style={[styles.header, { marginTop: 20 }]}>
                  <View style={{ width: "17%" }}></View>
                  <View style={{ width: "75%" }}>
                    <Text style={styles.text}>
                      ADDITIONAL STOP:{" "}
                      <Text style={styles.textBold}>
                        {data?.additional_stop_info}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}

              <View style={[styles.header, { marginTop: 20 }]}>
                <View style={{ width: "17%" }}>
                  {data?.return_location && (
                    <Text style={styles.text}>
                      <Text style={styles.textBold}>Return PickUp: </Text>
                      {data?.return_time
                        ? dayjs.tz(data?.return_time).format("HH:mm")
                        : ""}
                    </Text>
                  )}
                </View>
                <View style={{ width: "75%" }}>
                  <Text style={styles.text}>
                    DROP OFF LOCATION:{" "}
                    <Text style={styles.textBold}>{data?.to_location}</Text>
                  </Text>
                  <Text style={[styles.text, { marginLeft: 99 }]}>
                    {data?.to_address}
                  </Text>
                  <Text style={[styles.text, { marginLeft: 99 }]}>
                    {data?.to_city}, {data?.to_state}
                  </Text>
                </View>
              </View>

              {(data?.additional_stop_detail === "Both" ||
                data?.additional_stop_detail === "Return") && (
                <View style={[styles.header, { marginTop: 20 }]}>
                  <View style={{ width: "17%" }}></View>
                  <View style={{ width: "75%" }}>
                    <Text style={styles.text}>
                      ADDITIONAL STOP:{" "}
                      <Text style={styles.textBold}>
                        {data?.additional_stop_info}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}

              {data?.return_location ? (
                <View style={[styles.header, { marginTop: 20 }]}>
                  <View style={{ width: "17%" }}></View>
                  <View style={{ width: "75%" }}>
                    <Text style={styles.text}>
                      END LOCATION:{" "}
                      <Text style={styles.textBold}>
                        {data?.return_location}
                      </Text>
                    </Text>
                    <Text style={[styles.text, { marginLeft: 75 }]}>
                      {data?.return_address}
                    </Text>
                    <Text style={[styles.text, { marginLeft: 75 }]}>
                      {data?.return_city}, {data?.return_state}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          <Text style={[styles.textBold, { marginTop: 10 }]}>
            Instructions: {data?.instructions}
          </Text>

          <View style={styles.header2}>
            <Text
              style={[styles.textBold, { width: "30%", textAlign: "center" }]}
            >
              PLEASE FUEL THE BUS: MINIMUM OF 3/4 TANK
            </Text>
            <Text
              style={[styles.textBold, { width: "30%", textAlign: "center" }]}
            >
              PARK THE CAR ON BUS SPOT
            </Text>
            <Text
              style={[styles.textBold, { width: "30%", textAlign: "center" }]}
            >
              LOG IN SAMSARA: COMPLETE PRE-TRIP WITH PICTURES
            </Text>
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

module.exports = DriverReport;
