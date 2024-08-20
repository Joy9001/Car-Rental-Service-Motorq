// import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import { OutlinedInput } from '@mui/material';
import { useState } from 'react';

function handleCarBooking(
	car,
	hourlyDuration = 0,
	dailyDuration = 0,
	setCarData,
	setStartDate,
	setEndDate,
	setTotalPrice,
	setBookedBy
) {
	if (hourlyDuration === 0 && dailyDuration === 0) {
		alert('Please enter duration to book');
		return;
	} else if (hourlyDuration !== 0 && dailyDuration !== 0) {
		alert('Please enter either hourly or daily duration');
		return;
	}
	axios
		.post('http://localhost:3000/customer/api/cars/book', {
			carId: car.id,
			hourlyDuration,
			dailyDuration,
		})
		.then((res) => {
			console.log(res);
			setCarData((prevData) => {
				const updatedData = prevData.map((item) => {
					if (item.id === car.id) {
						return res.data.carData;
					}
					setStartDate(res.data.startDate);
					setEndDate(res.data.endDate);
					setTotalPrice(res.data.totalPrice);
					setBookedBy(res.data.currentCustomer);
					return item;
				});
				return updatedData;
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

export default function CarCard({ car, setCarData }) {
	const [hourlyDuration, setHourlyDuration] = useState(0);
	const [dailyDuration, setDailyDuration] = useState(0);
	const [startDate, setStartDate] = useState(
		car.startDate ? car.startDate : new Date().toLocaleDateString()
	);
	const [endDate, setEndDate] = useState(
		car.endDate ? car.endDate : new Date().toLocaleDateString()
	);
	const [totalPrice, setTotalPrice] = useState(
		car.totalPrice ? car.totalPrice : 0
	);
	const [bookedBy, setBookedBy] = useState(car.currentCustomer);

	let buttonComponent;
	switch (car.status) {
		case 'available':
			buttonComponent = (
				<>
					<Typography variant="body2" color="text.secondary">
						Select duration to book
					</Typography>
					<OutlinedInput
						type="number"
						size="small"
						placeholder="Enter hours"
						margin="dense"
						value={hourlyDuration === 0 ? '' : hourlyDuration}
						onChange={(e) => setHourlyDuration(e.target.value)}
					/>
					OR
					<OutlinedInput
						type="number"
						size="small"
						placeholder="Enter days"
						margin="dense"
						value={dailyDuration === 0 ? '' : dailyDuration}
						onChange={(e) => setDailyDuration(e.target.value)}
					/>
					<Button
						style={{ marginTop: '10px' }}
						variant="contained"
						size="medium"
						fullWidth
						color="secondary"
						onClick={() =>
							handleCarBooking(
								car,
								hourlyDuration,
								dailyDuration,
								setCarData,
								setStartDate,
								setEndDate,
								setTotalPrice,
								setBookedBy
							)
						}>
						Book Now
					</Button>
				</>
			);
			break;
		case 'booked':
			buttonComponent = (
				<Button
					variant="contained"
					size="medium"
					fullWidth
					color="primary"
					disabled>
					Booked
				</Button>
			);
			break;
		case 'inTrip':
			buttonComponent = (
				<Button
					variant="contained"
					size="medium"
					fullWidth
					color="secondary"
					disabled>
					In Trip
				</Button>
			);
			break;
		case 'maintenance':
			buttonComponent = (
				<Button
					variant="contained"
					size="medium"
					fullWidth
					color="warning"
					disabled>
					Maintenance
				</Button>
			);
			break;
		default:
			buttonComponent = <></>;
	}

	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardMedia sx={{ height: 140 }} image={car.image} title="green iguana" />
			<CardContent>
				<Typography variant="body2" color="text.secondary" hidden>
					id: {car.id}
				</Typography>
				<Typography gutterBottom variant="h4" component="div">
					{car.model}
				</Typography>
				<Typography gutterBottom variant="h6" component="div">
					{car.make} - {car.year}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Hourly Rent - ${car.rentratehourly} / hour
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Daily Rent - ${car.rentratedaily} / hour
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Fuel Type - {car.fueltype}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Status - {car.status}
				</Typography>
				{(car.status === 'booked' || car.status === 'inTrip') && (
					<Typography variant="body2" color="text.secondary">
						Booked by - {bookedBy}
					</Typography>
				)}
				{car.status === 'booked' && (
					<>
						<Typography variant="body2" color="text.secondary">
							Start Date - {startDate}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							End Date - {endDate}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Total Price - ${totalPrice}
						</Typography>
					</>
				)}
				<Rating value={car.averageRating} readOnly />
			</CardContent>
			<CardActions style={{ flexDirection: 'column' }}>
				{buttonComponent}
			</CardActions>
		</Card>
	);
}

CarCard.propTypes = {
	car: PropTypes.object.isRequired,
	setCarData: PropTypes.func.isRequired,
};
