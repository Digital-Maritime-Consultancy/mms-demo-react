import { LatLngTuple } from 'leaflet';
import { Marker, Popup } from 'react-leaflet'

export interface AgentMarkerProp {
    position: LatLngTuple;
    mrn: string;
  }
  
  export const AgentMarker = (
      {
        mrn,
        position,
      }: AgentMarkerProp
      ) =>
      <Marker position={position}>
        <Popup>
          {mrn}
        </Popup>
      </Marker>