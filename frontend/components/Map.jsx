import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useOutletContext } from 'react-router-dom';
import * as L from 'leaflet';
import { useEffect, useState } from 'react';

export default function Map() {
	const { data } = useOutletContext();
	const [positions, setPositions] = useState([]);
	useEffect(() => {
		let pos = data.map((car) => {
			let coordinates = car.location.split(',');
			return {
				id: car.id,
				status: car.status,
				lng: parseFloat(coordinates[0]),
				lat: parseFloat(coordinates[1]),
			};
		});
		setPositions(pos);
	}, [data]);

	function getIcon(status) {
		switch (status) {
			case 'available':
				return L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
					iconSize: [40, 40],
					iconAnchor: [20, 40],
					popupAnchor: [0, -40],
				});
			case 'booked':
				return L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
					iconSize: [40, 40],
					iconAnchor: [20, 40],
					popupAnchor: [0, -40],
				});
			case 'inTrip':
				return L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
					iconSize: [40, 40],
					iconAnchor: [20, 40],
					popupAnchor: [0, -40],
				});
			case 'maintenance':
				return L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
					iconSize: [40, 40],
					iconAnchor: [20, 40],
					popupAnchor: [0, -40],
				});
			default:
				return L.icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
					iconSize: [40, 40],
					iconAnchor: [20, 40],
					popupAnchor: [0, -40],
				});
		}
	}
	return (
		<MapContainer
			center={[13.55504, 80.02]}
			zoom={13}
			scrollWheelZoom={false}
			style={{
				height: '400px',
				width: '1176px',
				marginTop: '2rem',
				marginBottom: '2rem',
			}}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{positions.map((position) => (
				<Marker
					key={position.id}
					position={[position.lat, position.lng]}
					icon={getIcon(position.status)}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			))}
			{/* <Marker
				position={[51.505, -0.09]}
				icon={
					getIcon()
				}>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker> */}
		</MapContainer>
	);
}
