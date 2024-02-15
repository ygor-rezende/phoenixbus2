import { useMemo, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const GoogleMaps = (props) => {
  const mapRef = useRef();
  const containerRef = useRef();

  const { origin, destination } = props;

  useEffect(() => {
    async function initMap() {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      const geocoder = new window.google.maps.Geocoder();

      //Map library import and reference
      const { Map } = await window.google.maps.importLibrary("maps");
      mapRef.current = new Map(containerRef.current, {
        center: { lat: 28.538336, lng: -81.379234 },
        zoom: 8,
      });

      //Find the lat and lng for the origin and destination
      geocoder.geocode({ address: origin }, (results, status) => {
        if (status === "OK") {
          mapRef.current.setCenter(results[0]?.geometry.location);
        } else {
          console.log("Geocode couldnt get address location: ", status);
        }
      });

      //setting directions on map
      directionsRenderer.setMap(mapRef.current);

      const request = {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK") directionsRenderer.setDirections(result);
      });

      //create custom button
      const buttonDiv = document.createElement("div");
      const buttonControl = createButton();
      buttonDiv.appendChild(buttonControl);
      mapRef.current.controls[
        window.google.maps.ControlPosition.TOP_CENTER
      ].push(buttonDiv);
    } //init map

    function createButton() {
      const controlButton = document.createElement("button");

      controlButton.style.backgroundColor = "#fff";
      controlButton.style.border = "2px solid #fff";
      controlButton.style.borderRadius = "3px";
      controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlButton.style.color = "rgb(25,25,25)";
      controlButton.style.cursor = "pointer";
      controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
      controlButton.style.fontSize = "16px";
      controlButton.style.lineHeight = "38px";
      controlButton.style.margin = "8px 0 22px";
      controlButton.style.padding = "0 5px";
      controlButton.style.textAlign = "center";
      controlButton.textContent = "Open on Google Maps";
      controlButton.title = "Click to open on Maps";
      controlButton.type = "button";

      controlButton.addEventListener("click", () => {
        window.open(
          `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&origin=${origin}&destination=${destination}`
        );
      });

      return controlButton;
    } //createButton

    initMap();
  });

  return (
    <div id="mapsContainer" className="map-container" ref={containerRef}></div>
  );
};

export default GoogleMaps;
