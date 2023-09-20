import { MapContainer, Marker, Popup } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet'

export interface MapProp {

}
const position = {lat:51.505, lng:-0.09}

export const Map = (
    {}: MapProp
    ) =>
    <MapContainer id="map" className="h-100" center={[55.627884, 12.515491]} zoom={4} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[55.627884, 12.515491]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
        