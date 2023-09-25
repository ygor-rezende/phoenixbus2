import { useReducer } from "react";
import {
  Alert,
  AlertTitle,
  TextField,
  Autocomplete,
  Button,
  Snackbar,
  Divider,
  Box,
} from "@mui/material";

import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../utils/table_generic";

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const listOfStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const initialState = {
  agency: "",
  contact: "",
  address1: "",
  address2: "",
  city: "",
  state: null,
  zip: "",
  country: "",
  phone: "",
  fax: "",
  email: "",
  remark: "",
  openSnakbar: false,
  error: null,
  success: false,
};

export const AddClient = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //Get all clients data
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallclients`
      );
      let responseData = await response.json();
      responseData = responseData.map((item) => {
        const client = {
          id: item.client_id,
          agency: item.agency,
          contact: item.contact,
          address1: item.address1,
          address2: item.address2,
          city: item.city,
          state: item.client_state,
          zip: item.zip,
          country: item.country,
          phone: item.phone,
          fax: item.fax,
          email: item.email,
          remark: item.remark,
        };
        return client;
      });
      return responseData;
    } catch (err) {
      console.error(err);
    }
  };

  //handle updates in the fields
  const handleOnChange = (e) => setState({ [e.target.id]: e.target.value });

  //handle changes on phone field
  const handlePhoneChange = (value, info) => {
    setState({ phone: value });
  };

  //handle changes on fax field
  const handleFaxChange = (value, info) => {
    setState({ fax: value });
  };

  //handle form submit
  const handleSubmit = async (event) => {
    //if the autocomplete is null do not complete
    if (state.state === null) {
      event.preventDefault();
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/createclient`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            agency: state.agency,
            contact: state.contact,
            address1: state.address1,
            address2: state.address2,
            city: state.city,
            state: state.state,
            zip: state.zip,
            country: state.country,
            phone: state.phone,
            fax: state.fax,
            email: state.email,
            remark: state.remark,
          },
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    //if an error happens when signing up set the error
    if (data.msg) {
      setState({ success: false, error: data.msg, openSnakbar: true });
    } else {
      //if no error set success to display message
      setState({ msg: data, error: null, success: true, openSnakbar: true });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ openSnakbar: false });
  };

  const headings = [
    {
      id: "agency",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Agency",
    },
    {
      id: "contact",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Contact",
    },
    { id: "city", isNumeric: false, isPaddingDisabled: false, label: "City" },
    { id: "phone", isNumeric: false, isPaddingDisabled: false, label: "Phone" },
    { id: "fax", isNumeric: false, isPaddingDisabled: false, label: "Fax" },
    {
      id: "email",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "E-Mail",
    },
  ];

  return (
    <div className="client-container">
      <div className="client-container-box">
        <form onSubmit={handleSubmit}>
          <Box className="clientbox1">
            <TextField
              className="textfield"
              id="agency"
              required
              label="Agency"
              type="text"
              placeholder="Agency"
              value={state.agency}
              onChange={handleOnChange}
            />
            <TextField
              className="textfield"
              id="contact"
              required
              label="Contact"
              type="text"
              placeholder="Contact"
              value={state.contact}
              onChange={handleOnChange}
            />

            <TextField
              className="textfield"
              id="address1"
              required
              label="Adress 1"
              type="text"
              placeholder="Address 1"
              value={state.address1}
              onChange={handleOnChange}
            />

            <TextField
              className="textfield"
              id="address2"
              label="Address 2"
              type="text"
              placeholder="Address 2"
              value={state.address2}
              onChange={handleOnChange}
            />

            <TextField
              className="textfield"
              id="city"
              required
              label="City"
              type="text"
              placeholder="City"
              value={state.city}
              onChange={handleOnChange}
            />
            <div
              id="vehicle-year-box"
              className="textfield"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="states"
                required
                value={state.state}
                onChange={(e, newValue) => setState({ state: newValue })}
                options={listOfStates}
                sx={{ width: 200 }}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                  <TextField required {...params} label="State" />
                )}
              />
            </div>
            <TextField
              className="textfield"
              id="zip"
              required
              label="Zipcode"
              type="text"
              placeholder="Zipcode"
              value={state.zip}
              inputProps={{ maxLength: 6 }}
              onChange={handleOnChange}
            />

            <TextField
              className="textfield"
              id="country"
              required
              label="Country"
              type="text"
              placeholder="Country"
              value={state.country}
              onChange={handleOnChange}
            />

            <MuiTelInput
              className="textfield"
              id="phone"
              defaultCountry="US"
              required
              label="Phone"
              placeholder="Phone"
              value={state.phone}
              onChange={handlePhoneChange}
              onlyCountries={["US", "CA"]}
              inputProps={{ maxLength: 15 }}
            />

            <MuiTelInput
              className="textfield"
              id="fax"
              defaultCountry="US"
              label="Fax"
              type="tel"
              placeholder="Fax"
              onlyCountries={["US", "CA"]}
              inputProps={{ maxLength: 15 }}
              value={state.fax}
              onChange={handleFaxChange}
            />

            <TextField
              className="textfield"
              id="email"
              required
              label="E-Mail"
              type="email"
              placeholder="E-Mail"
              value={state.email}
              onChange={handleOnChange}
            />

            <TextField
              className="textfield"
              id="remark"
              label="Remarks"
              type="text"
              placeholder="Remarks"
              multiline
              rows={4}
              value={state.remark}
              onChange={handleOnChange}
            />
            <p></p>
          </Box>
          <Button
            variant="outlined"
            type="submit"
            style={{
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            Save
          </Button>
          <p></p>
          <Snackbar
            open={state.error && state.openSnakbar}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert severity="error" onClose={handleClose}>
              <AlertTitle>Error</AlertTitle>
              {state.error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={state.success && state.openSnakbar}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert severity="success" onClose={handleClose}>
              <AlertTitle>Client Saved</AlertTitle>
              Client created!
            </Alert>
          </Snackbar>
        </form>
        <p></p>
        <div id="table-container">
          <Divider />
          <p></p>
          <EnhancedTable headings={headings} loadData={getData} />
        </div>
      </div>
    </div>
  );
};
