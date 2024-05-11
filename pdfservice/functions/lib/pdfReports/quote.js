const React = require("react");
const {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
  PDFViewer,
  pdf,
  renderToStream
} = require("@react-pdf/renderer");
const fs = require("fs");
const path = require("path");
const PhoenixLogo = fs.readFileSync(path.join(__dirname, "../images/phoenix_logo.png"));
const Roboto = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf";
const RobotoBold = "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf";
const RobotoItalic = "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf";
Font.register({
  family: "Roboto",
  fonts: [{
    src: Roboto
  }, {
    src: RobotoBold,
    fontWeight: 700
  }, {
    src: RobotoItalic,
    fontStyle: "italic"
  }]
});
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto",
    textAlign: "center",
    marginBottom: 15
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15
  },
  imageSmall: {
    marginHorizontal: 10,
    width: "80px",
    marginVertical: 15,
    position: "absolute",
    top: 25,
    right: 25
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  header2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  contactBoard: {
    margin: 10,
    border: 1,
    padding: 5
  },
  twoColums: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 10
  },
  textCenter: {
    fontFamily: "Roboto",
    fontSize: 9,
    textAlign: "center",
    color: "#52595D",
    marginBottom: 5
  },
  textJustify: {
    fontFamily: "Roboto",
    fontSize: 10,
    textAlign: "justify"
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify"
  },
  textBold: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: 700
  },
  textItalic: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontStyle: "italic"
  },
  h2: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10
  },
  h3: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20
  },
  h4: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10
  },
  terms: {
    marginTop: 20
  },
  innerBoard: {
    marginLeft: 10,
    marginTop: 10
  },
  bulletPoints: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 7
  },
  contentSection: {
    marginTop: 20,
    marginBottom: 10,
    borderTop: 1
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontSize: "9"
  },
  serviceRow: {
    marginBottom: 3,
    fontWeight: "semibold",
    borderBottom: 0.5
  },
  detailsSection: {
    marginBottom: 10
  },
  detailsRow: {
    marginBottom: 5
  }
});
const QuoteReport = props => {
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
    services,
    details,
    locations,
    quoteDetails
  } = props;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  //Exclude services that are Dead-Head
  const filteredServices = services?.filter(e => e.service_code !== "DH");

  //Deposit
  let depositCost = quotedCost * deposit / 100;
  //Cost divided by passengers
  let dividedCost = quotedCost / passengers;
  depositCost = currencyFormatter.format(depositCost);
  dividedCost = currencyFormatter.format(dividedCost);

  //Create a unique array with services and details
  //Return an array with an array of services and its details
  const allData = filteredServices?.map(service => {
    let thisDetails = details?.flat()?.filter(detail => detail.service_id === service.service_id);
    return [service, thisDetails];
  });
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Quote"), /*#__PURE__*/React.createElement(View, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, null, "Reference #: ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, invoiceNum)), /*#__PURE__*/React.createElement(Text, null, "Sales Representative: ", salesPerson), /*#__PURE__*/React.createElement(Text, null, "Quote Date: ", date))), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.contentSection
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.innerBoard
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Dear Mr./Ms. ", client?.contact, ","), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "Greetings from Phoenix Bus, Inc.!"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, "It will be our honor to assist you and your group with your transportation needs. Based on your email/phone call, your trip details and itinerary are currently as follows:")), /*#__PURE__*/React.createElement(View, {
    style: styles.contactBoard
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.twoColums
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, null, "Email: ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, client.email)), /*#__PURE__*/React.createElement(Text, null, "Phone: ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, client.phone))), /*#__PURE__*/React.createElement(View, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, null, "From: ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, tripStart)), /*#__PURE__*/React.createElement(Text, null, "Through: ", /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, tripEnd)))), /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      textTransform: "uppercase",
      marginTop: 10
    }]
  }, quoteDetails), /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      marginTop: 10
    }]
  }, "*Quote may be subject to change after ", quoteExp, " hrs")), /*#__PURE__*/React.createElement(View, {
    style: styles.innerBoard
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textJustify
  }, "We ensure that all of your transportation needs are pre-planned with meticulous care so that we can provide you with fast and convenient service. Our executive fleet vehicles are pristine and come with with full air conditioning, and a uniformed chauffer. All of our chauffeurs are drug tested, DOT licensed, certified by Jessica Lunsford Law, and wear professional attire. With monitoring all flight arrivals, we provide professional, prompt, courteous, and safe transportation service.")), /*#__PURE__*/React.createElement(View, {
    style: styles.innerBoard
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.bulletPoints
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "\u2022"), /*#__PURE__*/React.createElement(Text, {
    style: [{
      marginLeft: 10
    }, styles.textItalic]
  }, "The total for your reservation would be", " "), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, currencyFormatter.format(quotedCost)), /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, " ", "(Driver gratuitiy not included)")), /*#__PURE__*/React.createElement(View, {
    style: styles.bulletPoints
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "\u2022"), /*#__PURE__*/React.createElement(Text, {
    style: [{
      marginLeft: 10
    }, styles.textItalic]
  }, "If divided by the the", " "), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, passengers), /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, " ", "passengers, the cost per person would only be", " "), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, dividedCost)), /*#__PURE__*/React.createElement(View, {
    style: styles.bulletPoints
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "\u2022"), /*#__PURE__*/React.createElement(View, {
    style: {
      marginLeft: 10
    }
  }, /*#__PURE__*/React.createElement(Text, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, "All we need to reserve this booking is a deposit of", " "), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, deposit, "%"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, " or "), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, depositCost), /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, " ", "and we\u2019ll send you booking confirmation! (if you are a public school no deposit is required)")))), /*#__PURE__*/React.createElement(View, {
    style: styles.bulletPoints
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, "\u2022"), /*#__PURE__*/React.createElement(Text, {
    style: [{
      marginLeft: 10
    }, styles.textBold]
  }, "Sales Tax waived!"))), /*#__PURE__*/React.createElement(View, {
    style: {
      marginTop: 20,
      borderBottom: 1
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.h2
  }, "AMENITIES"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textCenter
  }, "Motorcoaches which allow from 45-57 pax or Mini Coach Bus with capacity for 18-39 pax or Van for 14 pax."), /*#__PURE__*/React.createElement(Text, {
    style: styles.textCenter
  }, "Wireless internet (extra) AM/FM REI Video system w/5 TV's with DVD/VCD/CD/MP3/MP4 player."), /*#__PURE__*/React.createElement(Text, {
    style: styles.textCenter
  }, "PA System/Passenger pull-down shades/Passenger seat grab handles/Passenger seat footrests/Restroom/Reclining Seats/Shaded Windows.")), /*#__PURE__*/React.createElement(View, {
    style: styles.innerBoard
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, "We take pride in being registered and affiliated with several recognized organizations including the Florida School Counties, Orlando Theme Parks, Orlando Magic Authorized Ticket Reseller and Experience Kissimmee."), /*#__PURE__*/React.createElement(Text, {
    style: styles.h3
  }, "THANK YOU AND HAVE A GREAT DAY!"))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, null, "Thank you for your business"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))), /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(Image, {
    style: styles.imageSmall,
    src: PhoenixLogo
  }), /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.h4
  }), /*#__PURE__*/React.createElement(View, {
    style: styles.terms
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.textBold, {
      marginBottom: 10
    }]
  }, "PAYMENT AND DEPOSIT TERMS"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "A NON REFUNDABLE DEPOSIT MAY BE REQUIRED TO CONFIRM YOUR BOOKING (SEE QUOTE). ALL BOOKINGS SHOULD BE PAID IN FULL 7 DAYS PRIOR TO THE FIRST SERVICE. A 90% REFUND WILL BE PROVIDED FOR BOOKINGS CANCELLED 7 DAYS PRIOR TO FIRST SERVICE. ALL CANCELLATIONS WITHIN 7 DAYS OF FIRST SERVICE WILL BE CHARGED THE FULL AMOUNT OF SERVICE."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "EACH DRIVER IS ALLOWED UP TO 10 HRS OF NONCONSECUTIVE DRIVE TIME AND 15 HRS OF WORK TIME EACH DAY AS PER DOT (DEPARTMENT OF TRANSPORTATION) REGULATIONS. TIPPING IS APPRECIATED AND IS AT YOUR DISCRETION. CUSTOMARY AMOUNTS ARE 7, 12, OR 18% OF THE TOTAL COST."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "PERSONAL BAGGAGE, INSTRUMENTS, EQUIPMENTS AND OTHER PROPERTIES WILL BE LIMITED TO THE CAPACITY OF THE VEHICLE. CARRIER ASSUMES NO RESPONSIBILITIES OR LIABILITIES FOR DAMAGED, STOLEN OR LOST ITEMS TRANSPORTED OR LEFT IN ITS VEHICLE."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "RATES AND CHARGES ARE BASED ON THE INFORMATION PROVIDED. ALL RATES AND CHARGES ARE SUBJECT TO CHANGE BASED ON ACTUAL SERVICES RENDERED. IF DURING THE TRIP THE CHARTERING PARTY DESIRES TO CHANGE ROUTING OR SERVICES, ADDITIONAL CHARGES WILL BE ASSESSED AND COLLECTED, BASED ON AVAILABILITY AT TIME OF CHANGE."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "CARRIER WILL NOT BE LIABLE FOR DELAYS CAUSED BY ACCIDENTS, BREAKDOWNS, BAD ROAD CONDITIONS, INCLEMENT WEATHER, AND OTHER CONDITIONS BEYOND ITS CONTROL. IF, IN THE OPINION OF THE CARRIER, CONDITIONS MAKE IT INADVISABLE TO OPERATE CHARTER SERVICE AT ANY POINT IN ROUTE, THE CARRIER RESERVES THE RIGHT TO DISCONTINUE SERVICE AND WILL NOT BE HELD LIABLE THEREFORE, OR BE CAUSED TO BE HELD FOR DAMAGE FOR ANY REASON WHATSOEVER. ADDITIONAL COSTS, SUCH AS MEALS, LODGING AND TRANSPORTATION WILL IN THIS RESPECT BECOME THE RESPONSIBILITY OF THE CHARTERING PARTY."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "PHOENIX BUS INC, RESERVES ITS RIGHT TO LEASE EQUIPMENT FROM OTHER COMPANIES IN ORDER TO FULFILL THIS AGREEMENT. PHOENIX BUS INC, RESERVES THE RIGHT TO USE ASSIGNED MOTORCOACHES FOR MULTIPLE CHARTERS AND CUSTOMERS ON THE SAME DAY."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "PHOENIX BUS INC, SHALL NOT BE LIABLE FOR LOSS OF TIME OR REVENUE DUE TO MECHANICAL FAILURE OR INCLEMENT WEATHER. EATING OR DRINKING IS NOT ALLOWED IN THE COACHES. PARKING IS THE RESPONSIBILITY OF THE CUSTOMER"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "CARRIER RESERVES THE RIGHT TO REFUSE TO TRANSPORT ANY PERSON OR PERSONS UNDER THE INFLUENCE OF ALCOHOL AND/OR DRUGS, OR WHOSE CONDUCT IS SUCH AS TO MAKE HIM/HER OBJECTIONABLE TO OTHER PASSENGER OR THE SAFE OPERATION OF THE VEHICLE."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "DAMAGE TO SEATS, WINDOWS OR OTHER EQUIPMENT OR PART OF THE COACH, WHICH IS CAUSED BY ANY MEMBER OF THE CHARTERING PARTY, SHALL BE THE RESPONSIBILITY OF THE CHARTERING PARTY AND THE CHARTERING PARTY WILL PAY THE COST TO REPAIR AND LOSS OF SERVICE DUE TO SUCH DAMAGE."))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, null, "Thank you for your business"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
module.exports = QuoteReport;