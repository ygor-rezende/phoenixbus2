import React from "react";
import { Page, Text, Image, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
import PhoenixLogo from "../../images/phoenix_logo.png";
import Roboto from "../../fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "../../fonts/Roboto/Roboto-Bold.ttf";
import RobotoItalic from "../../fonts/Roboto/Roboto-Italic.ttf";
import { Table, TableCell, TableHeader, TableRow } from "./Table";
import dayjs from "dayjs";
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
    textAlign: "center"
  },
  image: {
    marginHorizontal: 10,
    width: "150px",
    marginVertical: 15
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 10
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
    textAlign: "center"
  },
  innerBoard: {
    marginLeft: 10
  },
  contentSection: {
    marginTop: 20,
    marginBottom: 10,
    borderTop: 1
  },
  tableSection: {
    borderTop: 1,
    marginBottom: 20
  },
  signatureSection: {
    marginTop: 30,
    fontSize: 11,
    marginBottom: 30
  },
  signature: {
    textAlign: "left",
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 10
  },
  serviceRow: {
    marginBottom: 3,
    fontWeight: "semibold",
    borderBottom: 0.5,
    borderTop: 0.5
  },
  detailsRow: {
    marginBottom: 5
  },
  detailsSection: {
    marginBottom: 10
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: 1,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row"
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontSize: "9"
  }
});
const Contract = props => {
  const {
    date,
    invoiceNum,
    client,
    category,
    passengers,
    services,
    details,
    locations,
    transactions,
    poRef,
    responsible,
    responsibleEmail
  } = props;
  const serviceTypes = [{
    type: "RT",
    name: "ROUND-TRIP"
  }, {
    type: "CH",
    name: "CHARTER"
  }, {
    type: "OW",
    name: "ONE-WAY"
  }, {
    type: "DH",
    name: "DEAD-HEAD"
  }, {
    type: "SH",
    name: "SHUTTLE"
  }];
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  //Exclude services that are Dead-Head
  const filteredServices = services.filter(e => e.service_code !== "DH");

  //Get total payment from transactions
  const totPay = transactions?.find(e => e.invoice === invoiceNum)?.total_pay || 0.0;

  //Total invoice
  let totalCharges = filteredServices?.reduce((sum, current) => {
    return sum + Number(current.gratuity) + current.charge * current.qty;
  }, 0);
  let totalTax = filteredServices?.map(service => {
    return {
      tax: service.sales_tax,
      charge: service.charge,
      qty: service.qty
    };
  })?.reduce((sum, service) => {
    return sum + Number(service.tax * service.charge * service.qty) / 100;
  }, 0);

  //let credit = (totalCharges * deposit) / 100;
  let totalAmount = totalCharges - totPay + totalTax;
  let credit = currencyFormatter.format(totPay);
  totalAmount = currencyFormatter.format(totalAmount);
  totalCharges = currencyFormatter.format(totalCharges);

  //Create a unique array with services and details
  //Return an array with an array of services and its details
  const allData = filteredServices?.map(service => {
    let thisDetails = details?.flat().filter(detail => detail.service_id === service.service_id);
    return [service, thisDetails];
  });
  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Booking / Confirmation"), /*#__PURE__*/React.createElement(View, {
    style: styles.text
  }, /*#__PURE__*/React.createElement(Text, null, "To: ", client.agency), /*#__PURE__*/React.createElement(Text, null, "Attn: ", client.contact), client.phone && /*#__PURE__*/React.createElement(Text, null, "Phone: ", client.phone), client.email && /*#__PURE__*/React.createElement(Text, null, "Email: ", client.email), client.address1 && /*#__PURE__*/React.createElement(Text, null, client.address1), client.address1 && /*#__PURE__*/React.createElement(Text, null, client.city, ", ", client.zip, " ", client.client_state), responsible && /*#__PURE__*/React.createElement(Text, null, "Responsible: ", responsible), responsibleEmail && /*#__PURE__*/React.createElement(Text, null, "Responsible Email: ", responsibleEmail), poRef && /*#__PURE__*/React.createElement(Text, null, "PO/REF #: ", poRef))), /*#__PURE__*/React.createElement(Image, {
    style: styles.image,
    src: PhoenixLogo
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.contentSection
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.textItalic, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, null, "Dear Client:"), /*#__PURE__*/React.createElement(Text, null, "Thank you for choosing us to provide you with your transportation needs. We pride ourselves in having the finest motorcoach service available. In order to ensure that you receive the best possible service, we ask you to review the information below, sign and fax back to us at 407-517-4788.")), /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, date), /*#__PURE__*/React.createElement(Text, {
    style: styles.textItalic
  }, "PHOENIX BUS INC"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold,
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "33%",
    align: "left"
  }, "Category: ", category), /*#__PURE__*/React.createElement(TableCell, {
    width: "33%",
    align: "center"
  }, "Number of Seats: ", passengers), /*#__PURE__*/React.createElement(TableCell, {
    width: "33%",
    align: "right"
  }, "Invoice: ", invoiceNum)))), /*#__PURE__*/React.createElement(View, {
    style: styles.h2
  }, /*#__PURE__*/React.createElement(Text, null, "SERVICES")), /*#__PURE__*/React.createElement(View, {
    style: styles.tableSection
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "15%",
    align: "left"
  }, "Date"), /*#__PURE__*/React.createElement(TableCell, {
    width: "25%",
    align: "left"
  }, "Service"), /*#__PURE__*/React.createElement(TableCell, {
    width: "11%",
    align: "right"
  }, "QTY"), /*#__PURE__*/React.createElement(TableCell, {
    width: "17%",
    align: "right"
  }, "Charge"), /*#__PURE__*/React.createElement(TableCell, {
    width: "17%",
    align: "right"
  }, "Gratuity"), /*#__PURE__*/React.createElement(TableCell, {
    width: "17%",
    align: "right"
  }, "SubTotal")), allData?.map(service => /*#__PURE__*/React.createElement(View, {
    key: service[0]?.service_id
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.serviceRow
  }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    width: "15%",
    align: "left"
  }, dayjs(service[0]?.service_date).format("MM/DD/YYYY")), /*#__PURE__*/React.createElement(TableCell, {
    width: "25%",
    align: "left"
  }, `${service[0]?.service_name} (${serviceTypes.find(e => e.type === service[0]?.service_code)?.name || service[0]?.service_code})`), /*#__PURE__*/React.createElement(TableCell, {
    width: "11%",
    align: "right"
  }, service[0]?.qty), /*#__PURE__*/React.createElement(TableCell, {
    width: "17%",
    align: "right"
  }, currencyFormatter.format(service[0]?.charge)), /*#__PURE__*/React.createElement(TableCell, {
    width: "17%",
    align: "right"
  }, currencyFormatter.format(service[0]?.gratuity)), /*#__PURE__*/React.createElement(TableCell, {
    width: "17%",
    align: "right"
  }, currencyFormatter.format(service[0]?.charge * service[0]?.qty + Number(service[0]?.gratuity))))), /*#__PURE__*/React.createElement(View, {
    style: styles.detailsSection
  }, service[1]?.map(detail => {
    const fromLocation = locations?.find(e => e.location_id === detail.from_location_id);
    const toLocation = locations?.find(e => e.location_id === detail.to_location_id);
    const returnLocation = locations?.find(e => e.location_id === detail.return_location_id);
    return /*#__PURE__*/React.createElement(View, {
      key: detail.detail_id,
      style: styles.detailsRow
    }, /*#__PURE__*/React.createElement(TableRow, null, fromLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: returnLocation ? "32%" : "49%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: {
        fontWeight: "semibold"
      }
    }, "From: ", fromLocation?.location_name)), toLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: returnLocation ? "32%" : "49%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: {
        fontWeight: "semibold"
      }
    }, "To: ", toLocation?.location_name)), returnLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: "32%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: {
        fontWeight: "semibold"
      }
    }, "Return: ", returnLocation?.location_name))), /*#__PURE__*/React.createElement(TableRow, null, fromLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: returnLocation ? "32%" : "49%",
      align: "left"
    }, fromLocation?.address), toLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: returnLocation ? "32%" : "49%",
      align: "left"
    }, toLocation?.address), returnLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: "32%",
      align: "left"
    }, returnLocation?.address)), /*#__PURE__*/React.createElement(TableRow, null, fromLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: returnLocation ? "32%" : "49%",
      align: "left"
    }, fromLocation?.city, ",", " ", fromLocation.location_state, " ", fromLocation.zip), toLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: returnLocation ? "32%" : "49%",
      align: "left"
    }, toLocation?.city, ", ", toLocation.location_state, " ", toLocation.zip), returnLocation && /*#__PURE__*/React.createElement(TableCell, {
      width: "32%",
      align: "left"
    }, returnLocation?.city, ",", " ", returnLocation.location_state, " ", returnLocation.zip)), /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "50%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: {
        fontWeight: "semibold"
      }
    }, "Start Time:", " ", dayjs(detail.start_time).format("HH:mm")))), /*#__PURE__*/React.createElement(View, {
      style: {
        marginTop: 10,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
      width: "100%",
      align: "left"
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.textBold
    }, "Instructions:"), " ", detail.instructions))));
  }))))))), /*#__PURE__*/React.createElement(View, {
    style: styles.totalsSection
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      fontSize: 14
    }
  }, "NOTE: Times in Military time (24-hour clock)"), /*#__PURE__*/React.createElement(View, {
    style: [styles.textBold, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, "Total Charges"), /*#__PURE__*/React.createElement(Text, null, "Total Payment/Credit"), /*#__PURE__*/React.createElement(Text, null, "Sales Tax:"), /*#__PURE__*/React.createElement(Text, null, "Total Amount Due")), /*#__PURE__*/React.createElement(View, {
    style: [styles.text, styles.innerBoard]
  }, /*#__PURE__*/React.createElement(Text, {
    style: {
      marginBottom: 10
    }
  }, totalCharges), /*#__PURE__*/React.createElement(Text, null, "(", credit, ")"), /*#__PURE__*/React.createElement(Text, null, totalTax > 0 ? currencyFormatter.format(totalTax) : "Waived"), /*#__PURE__*/React.createElement(Text, {
    style: styles.textBold
  }, totalAmount))), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, null, "Thank you for your business"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))), /*#__PURE__*/React.createElement(Page, {
    style: styles.body
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.contentSection
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.textItalic, styles.h2, {
      margin: 10
    }]
  }, "TERMS AND CONDITIONS"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, styles.paragraph]
  }, "A 10% NON REFUNDABLE DEPOSIT IS REQUIRED TO CONFIRM YOUR BOOKING. ALL BOOKINGS SHOULD BE PAID IN FULL 7 DAYS PRIOR TO THE FIRST SERVICE. A 90% REFUND WILL BE PROVIDED FOR BOOKINGS CANCELLED 7 DAYS PRIOR TO FIRST SERVICE. ALL CANCELLATIONS WITHIN 7 DAYS OF FIRST SERVICE WILL BE CHARGED THE FULL AMOUNT OF SERVICE."), /*#__PURE__*/React.createElement(Text, {
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
  }, "DAMAGE TO SEATS, WINDOWS OR OTHER EQUIPMENT OR PART OF THE COACH, WHICH IS CAUSED BY ANY MEMBER OF THE CHARTERING PARTY, SHALL BE THE RESPONSIBILITY OF THE CHARTERING PARTY AND THE CHARTERING PARTY WILL PAY THE COST TO REPAIR AND LOSS OF SERVICE DUE TO SUCH DAMAGE.")), /*#__PURE__*/React.createElement(View, {
    style: styles.signatureSection
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.signature
  }, "Please sign, date and return ___________________________ Date: _____________"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.signature, styles.text]
  }, "Thank you: TO CONFIRM PLEASE EMAIL BACK SIGNED CONTRACT THEN EMAIL BACK AUTHORIZATION FORM OR/AND PAY ONLINE - CONTACT US IF THERE IS ANY QUESTIONS.")), /*#__PURE__*/React.createElement(View, {
    style: styles.footer,
    fixed: true
  }, /*#__PURE__*/React.createElement(Text, null, "3220 37TH ST * ORLANDO * FL * 32839 * PH: 888-755-5398 * FAX: 407-517-4788"), /*#__PURE__*/React.createElement(Text, null, "contact@phoenixbusorlando.com - www.phoenixbusorlando.com"), /*#__PURE__*/React.createElement(Text, null, "Thank you for your business"), /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `Page ${pageNumber} of ${totalPages}`
  }))));
};
export default Contract;