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

      //Num of unique invoices
      const invoices = data?.map((e) => e.invoice);
      const uniqueInvoices = new Set(invoices);

      //Total charge
      const totalCharge = data?.reduce((total, current) => {
        return total + Number(current.charge);
      }, 0);

      //set state
      uniqueInvoices?.size > 0
        ? setNumInvoices(uniqueInvoices.size)
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
        Number of Trips
      </Typography>
      <Typography component="p" variant="h5">
        {numTrips}
      </Typography>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {" "}
        Number of Invoices
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
