import { LatLngTuple } from "leaflet";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { TileLayer } from "react-leaflet";
import { useMap } from "react-leaflet";
import { MMSAgent } from "../../model/MMSAgent";
import { AgentMarker } from "./AgentMarker";

export interface MapProp {
  agents: MMSAgent[];
  reply: (mrn: string) => void;
}

interface FlyerProps {
  location: LatLngTuple;
}
const Flyer = ({ location }: FlyerProps) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(location);
  }, [location]);
  return <></>;
};

export const Map = forwardRef(({ agents, reply }: MapProp, ref) => {
  const [location, setLocation] = useState<LatLngTuple>([48.853534, 2.348099]);

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number) => setLocation([lat,lng] as LatLngTuple),
  }));
  
  useEffect(() => {}, [location, agents]);
  return (
    <MapContainer
      id="map"
      className="h-100"
      center={location}
      zoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Flyer location={location}></Flyer>
      {agents.map((agent: MMSAgent, idx) => {
        if (agent.latitude && agent.longitude) {
        const lat = parseFloat(agent.latitude);
        const lng = parseFloat(agent.longitude);
        return (
          <AgentMarker
            key={idx}
            position={[lat, lng] as LatLngTuple}
            mrn={agent.mrn}
            onClick={(evt) => reply(agent.mrn)}
          ></AgentMarker>
        )}
        else {return <div key={idx}></div>};
      })}
    </MapContainer>
  );
});
