import * as React from "react";
import Typography from "@mui/material/Typography";

export default function Summary(props) {
  const { data } = props;
  const [numTrips, setNumTrips] = React.useState(0);
  const [numInvoices, setNumInvoices] = React.useState(0);
  const [totalCharge, setTotalCharge] = React.useState(0.0);

  React.useEffect(() => {
    const calculateSummary = () => {
      //Total of trips
      const totTrips = data?.length;

      //Num of invoices
      const totInvoice = data?.filter((element, index, array) => {
        return array.indexOf(element) === index;
      });

      //Total charge
      const totalCharge = data?.reduce((total, current) => {
        return total + current.charge;
      }, 0);

      //set state
      totInvoice.length > 0
        ? setNumInvoices(totInvoice.length)
        : setNumInvoices(0);
      totTrips ? setNumTrips(totTrips) : setNumTrips(0);
      setTotalCharge(Number(totalCharge));
    };

    calculateSummary();
  }, [data]);
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {" "}
        Num of Trips
      </Typography>
      <Typography component="p" variant="h5">
        {numTrips}
      </Typography>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {" "}
        Num of Invoices
      </Typography>
      <Typography component="p" variant="h5">
        {numInvoices}
      </Typography>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {" "}
        Total Charges
      </Typography>
      <Typography component="p" variant="h5">
        ${totalCharge.toFixed(2)}
      </Typography>
    </React.Fragment>
  );
}
