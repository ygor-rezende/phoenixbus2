import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const GoogleAutoComplete = (props) => {
  const { updateFields, value, searchType } = props;

  GoogleAutoComplete.defaultProps = {
    searchType: "establishment",
  };

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry", "formatted_address", "address_components"],
    types: ["establishment"],
  };

  const addressOptions = {
    componentRestrictions: { country: "us" },
    fields: ["geometry", "formatted_address", "address_components"],
    types: ["address"],
  };

  useEffect(() => {
    if (searchType === "establishment")
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
    else
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        addressOptions
      );

    autoCompleteRef.current.addListener("place_changed", onPlaceChanged);
  }, [searchType]);

  useEffect(() => {
    inputRef.current.value = value;
  }, [value]);

  function onPlaceChanged() {
    const place = autoCompleteRef.current.getPlace();

    if (!place.geometry) {
      inputRef.current.value = "";
    } else {
      try {
        //get country
        const country =
          place.address_components.find((element) =>
            element.types.includes("country")
          )?.short_name ?? "";

        //get state
        const state =
          place.address_components.find((element) =>
            element.types.includes("administrative_area_level_1")
          )?.short_name ?? "";

        const zip =
          place.address_components.find((element) =>
            element.types.includes("postal_code")
          )?.long_name ?? "";

        const city =
          place.address_components.find((element) =>
            element.types.includes("locality")
          )?.long_name ?? "";

        let address1 =
          place.address_components.find((element) =>
            element.types.includes("street_number")
          )?.long_name ?? "";

        address1 +=
          " " +
            place.address_components.find((element) =>
              element.types.includes("route")
            )?.short_name ?? "";

        const fullAddress = place.formatted_address;

        updateFields(address1, city, state, zip, country, fullAddress);
      } catch (err) {
        console.error(err);
        //message saying couldn't get address
      }
    }
  }

  return (
    <input
      style={{
        fontFamily: "Roboto, Helvetica, Arial",
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: "1.1435em",
        borderRadius: "4px",
        alignItems: "center",
        padding: "16.5px 14px",
        margin: "10px 10px",
        width: "90%",
      }}
      id="addressAutocomplete"
      ref={inputRef}
      placeholder="Search address..."
      type="text"
    />
  );
};

export default GoogleAutoComplete;
