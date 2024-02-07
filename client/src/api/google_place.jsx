import { useRef, useEffect } from "react";

const GoogleAutoComplete = (props) => {
  const { updateFields, value } = props;

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry", "formatted_address"],
    types: ["establishment"],
  };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener("place_changed", onPlaceChanged);

    inputRef.current.value = value;
  }, [value]);

  function onPlaceChanged() {
    const place = autoCompleteRef.current.getPlace();

    if (!place.geometry) {
      inputRef.current.value = "";
    } else {
      const fullAddress = place.formatted_address
        .split(",")
        .map((e) => e.trim());
      const address1 = fullAddress[0];
      const city = fullAddress[1];
      const state = fullAddress[2].substring(0, 2);
      const zip = fullAddress[2].substring(2);
      const country = fullAddress[3];

      if (address1 && city && state && zip && country)
        updateFields(address1, city, state, zip, country, fullAddress);
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
        width: "91%",
      }}
      id="addressAutocomplete"
      ref={inputRef}
      placeholder="Search address..."
      type="text"
    />
  );
};

export default GoogleAutoComplete;
