import { Router } from 'express';
import Car from '../models/car.model.js';
import { formatCarData, deformatCarData } from '../helpers/fomatData.js';
import Booking from '../models/booking.model.js';
import transporter from '../helpers/nodeMailer.js';
import Customer from '../models/customer.model.js';

const router = Router();

router.get('/api/cars', async (req, res) => {
	const findCarsData = await Car.find(
		{},
		{
			ratings: 0,
		}
	);

	const carsData = findCarsData.map((car) => {
		return formatCarData(car);
	});
	// console.log(carsData);
	return res.json(carsData);
});

// create a car
router.post('/api/cars', async (req, res) => {
	// console.log(req.body);
	const newCarData = req.body;
	console.log(newCarData);

	const newCar = new Car({
		registrationNumber: newCarData.registrationNumber,
		make: newCarData.make,
		model: newCarData.model,
		year: newCarData.year,
		licenseNumber: newCarData.licenseNumber,
		rentRate: {
			daily: newCarData.rentratedaily,
			hourly: newCarData.rentratehourly,
		},
		location: {
			type: 'Point',
			coordinates: newCarData.location.split(',').map(Number),
		},
		status: newCarData.status,
		fuelType: newCarData.fueltype,
		currentCustomerId: newCarData.currentCustomerId,
		ratings: newCarData.ratings,
		averageRating: newCarData.averageRating,
	});

	const createdCar = await newCar.save();

	return res.status(201).json(formatCarData(createdCar));
});

// update a car
router.put('/api/cars/:id', async (req, res) => {
	const carId = req.params.id;
	let updatedCarData = req.body;
	updatedCarData = deformatCarData(updatedCarData);

	const updatedCar = await Car.findByIdAndUpdate(
		carId,
		{
			$set: updatedCarData,
		},
		{
			new: true,
		}
	);

	return res.json(formatCarData(updatedCar));
});

// delete a car data
router.delete('/api/cars/:id', async (req, res) => {
	const carId = req.params.id;

	await Car.findOneAndDelete({ _id: carId });

	return res.json({ message: 'Car deleted' });
});

// all pending booking requests
router.get('/api/bookings', async (req, res) => {
	const status = req.query.status;
	const findBookingData = await Booking.find({ status: status });
	const formatedBookingData = findBookingData.map((booking) => {
		if (booking) {
			return {
				_id: booking._id,
				carId: booking.carId,
				customerId: booking.customerId,
				startDate:
					booking.startDate.toLocaleDateString() +
					' ' +
					booking.startDate.toLocaleTimeString(),
				endDate:
					booking.endDate.toLocaleDateString() +
					' ' +
					booking.endDate.toLocaleTimeString(),
				totalPrice: booking.totalPrice,
				status: booking.status,
				rating: booking.rating,
			};
		}
	});
	return res.json(formatedBookingData);
});

// approve a booking cancellation request
router.post('/api/bookings/approve', async (req, res) => {
	const bookingId = req.body.bookingId;
	const status = req.body.status;

	const updatedBooking = await Booking.findByIdAndUpdate(
		bookingId,
		{
			$set: { status: status },
		},
		{
			new: true,
		}
	);

	const formatedBookingData = {
		_id: updatedBooking._id,
		carId: updatedBooking.carId,
		customerId: updatedBooking.customerId,
		startDate:
			updatedBooking.startDate.toLocaleDateString() +
			' ' +
			updatedBooking.startDate.toLocaleTimeString(),
		endDate:
			updatedBooking.endDate.toLocaleDateString() +
			' ' +
			updatedBooking.endDate.toLocaleTimeString(),
		totalPrice: updatedBooking.totalPrice,
		status: updatedBooking.status,
		rating: updatedBooking.rating,
	};

	const findCarData = await Car.findOne({ _id: updatedBooking.carId });
	findCarData.status = 'available';
	await findCarData.save();

	const formatedCarData = formatCarData(findCarData);

	// send mail to customer
	const findCutomer = await Customer.findById(updatedBooking.customerId);
	const mailOptions = {
		from: process.env.EMAIL,
		to: findCutomer.email,
		subject: 'Booking Cancellation Approved',
		text: `Your booking with booking id ${bookingId} has been cancelled successfully.`,
	};

	await transporter.sendMail(mailOptions);
	console.log('Booking cancellation email sent to:', findCutomer.email);

	return res.json({
		bookingData: formatedBookingData,
		updatedCarData: formatedCarData,
	});
});

export default router;
