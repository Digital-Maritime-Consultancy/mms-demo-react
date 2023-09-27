import L, { LatLngTuple } from "leaflet";
import { Marker, Popup } from "react-leaflet";

export interface EdgeRouterMarkerProp {
  position: LatLngTuple;
  name: string;
}

export const EdgeRouterMarker = ({ name, position }: EdgeRouterMarkerProp) => {
  const svgIcon = L.divIcon({
    html: `
    <svg
    class="icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
      fill="#1A1A1A"
    />
    <path
      d="M13.0623 5.5L10.0311 2.5L7 5.5H9.03113V8.5H11.0311V5.5H13.0623Z"
      fill="#1A1A1A"
    />
    <path
      d="M14 6.93782L11 9.96891L14 13V10.9689H17V8.96891H14V6.93782Z"
      fill="#1A1A1A"
    />
    <path
      d="M6 13.0622L9 10.0311L6 7V9.03109H3V11.0311H6V13.0622Z"
      fill="#1A1A1A"
    />
    <path
      d="M7.00012 14.5L10.0312 17.5L13.0623 14.5H11.0312V11.5H9.03121V14.5H7.00012Z"
      fill="#1A1A1A"
    />
  </svg>
  
`,
    className: "svg-icon",
    iconSize: [24, 40],
    iconAnchor: [12, 10],
  });

  return (
    <Marker position={position} icon={svgIcon}>
      <Popup>{name}</Popup>
    </Marker>
  );
};
