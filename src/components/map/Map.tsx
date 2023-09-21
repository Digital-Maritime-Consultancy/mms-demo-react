import { LatLngTuple } from 'leaflet';
import { MapContainer, Marker, Popup } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import { AgentMarker } from './AgentMarker';

export interface MapProp {
  positions: number[][];
}

export const Map = (
    {
      positions,
    }: MapProp
    ) =>
    <MapContainer id="map" className="h-100" center={[55.627884, 12.515491]} zoom={4} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {
    positions.map( (pos, idx) => 
      <AgentMarker key={idx} position={pos as LatLngTuple} mrn={"test"}></AgentMarker>
    )
  }
  
</MapContainer>
        