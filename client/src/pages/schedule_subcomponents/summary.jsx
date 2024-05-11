import * as React from "react";
import Typography from "@mui/material/Typography";
import { Paper, Stack } from "@mui/material";

export default function Summary(props) {
  const { data } = props;
  const [numTrips, setNumTrips] = React.useState(0);
  const [numInvoices, setNumInvoices] = React.useState(0);
  const [totalCharge, setTotalCharge] = React.useState(0.0);
  const [busQty, setBusQty] = React.useState(0);
  const [farmOutQty, setFarmOutQty] = React.useState(0);
  const [deadHeadQty, setDeadHeadQty] = React.useState(0);

  React.useEffect(() => {
    const calculateSummary = () => {
      //Total of trips
      const totTrips = data?.length;

      //Buses qty (no farmouts)
      const busQty = data?.filter((e) => e.use_farmout === false).length;

      //Farm-out qty
      const farmOutQty = data?.filter((e) => e.use_farmout === true).length;

      //Dead Head qty
      const deadHeadQty = data?.filter((e) => e.service_code === "DH").length;

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
      busQty ? setBusQty(busQty) : setBusQty(0);
      farmOutQty ? setFarmOutQty(farmOutQty) : setFarmOutQty(0);
      deadHeadQty ? setDeadHeadQty(deadHeadQty) : setDeadHeadQty(0);
    };

    calculateSummary();
  }, [data]);
  return (
    <React.Fragment>
      <Stack direction="row" spacing={1} justifyContent="space-around">
        <Paper elevation={1} style={{ padding: 10, textAlign: "center" }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {" "}
            Number of Trips
          </Typography>
          <Typography component="p" variant="h5">
            {numTrips}
          </Typography>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {" "}
            House's Buses
          </Typography>
          <Typography component="p" variant="h5">
            {busQty}
          </Typography>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {" "}
            Farm-Out's Buses
          </Typography>
          <Typography component="p" variant="h5">
            {farmOutQty}
          </Typography>
        </Paper>

        <Paper elevation={1} style={{ padding: 10, textAlign: "center" }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {" "}
            Dead Head Trips
          </Typography>
          <Typography component="p" variant="h5">
            {deadHeadQty}
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
        </Paper>
      </Stack>
    </React.Fragment>
  );
}
