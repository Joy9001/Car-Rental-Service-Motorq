import { Router } from 'express';
import Car from '../models/car.model.js';
import Customer from '../models/customer.model.js';
import Booking from '../models/booking.model.js';
import { formatCarData, deformatCarData } from '../helpers/fomatData.js';
import currentCustomerId from '../helpers/currentCustomer.js';
const router = Router();
import { userSockets, io } from '../server.js';
import transporter from '../helpers/nodeMailer.js';
import dotenv from 'dotenv';
dotenv.config();

router.get('/api/cars', async (req, res) => {
	const findCarsData = await Car.find(
		{},
		{
			ratings: 0,
		}
	).lean();

	const promise = Promise.all(
		findCarsData.map(async (car) => {
			const customerData = await Customer.findById(
				car.currentCustomerId
			).lean();

			if (
				car.status === 'booked' &&
				car.currentCustomerId == currentCustomerId
			) {
				// const findCustomerData = await Customer.findById(
				// 	car.currentCustomerId
				// ).lean();

				const findBookingData = await Booking.findOne({
					carId: car._id,
					customerId: currentCustomerId,
					status: 'confirmed',
				}).lean();

				return {
					...formatCarData(car),
					currentCustomer: customerData.name,
					startDate:
						findBookingData.startDate.toLocaleDateString() +
						' ' +
						findBookingData.startDate.toLocaleTimeString(),
					endDate:
						findBookingData.endDate.toLocaleDateString() +
						' ' +
						findBookingData.endDate.toLocaleTimeString(),
					totalPrice: findBookingData.totalPrice,
				};
			}
			return {
				...formatCarData(car),
				currentCustomer: customerData.name,
			};
		})
	);

	const carsData = await promise;

	// console.log(carsData);
	return res.json(carsData);
});

router.post('/api/cars/book', async (req, res) => {
	const { carId, hourlyDuration, dailyDuration } = req.body;

	// Validate input
	if (!carId || (!hourlyDuration && !dailyDuration)) {
		return res.status(400).json({ error: 'Invalid input data' });
	}
	try {
		const carData = await Car.findById(carId).lean();
		if (!carData) {
			return res.status(404).json({ error: 'Car not found' });
		}

		// const customerData = await Customer.findById(
		// 	carData.currentCustomerId
		// ).lean();
		// if (!customerData) {
		// 	return res.status(404).json({ error: 'Customer not found' });
		// }

		// final check if car is available
		if (carData.status === 'available') {
			await Car.findByIdAndUpdate(carId, {
				status: 'booked',
				currentCustomerId: currentCustomerId,
			});
		} else {
			return res.status(404).json({
				error: 'Car not available. Please chooose other available vehicles.',
			});
		}

		// Calculate end date and total price
		let endDate = new Date();
		let totalPrice = 0;

		if (dailyDuration) {
			console.log(endDate.getDate() + parseInt(dailyDuration));
			endDate.setDate(endDate.getDate() + parseInt(dailyDuration));
			totalPrice = parseFloat(carData.rentRate.daily) * parseInt(dailyDuration);
		} else if (hourlyDuration) {
			endDate.setHours(endDate.getHours() + parseInt(hourlyDuration));
			totalPrice =
				parseFloat(carData.rentRate.hourly) * parseFloat(hourlyDuration);
		}

		// console.log(totalPrice);

		// Create booking
		const bookingData = new Booking({
			carId,
			customerId: currentCustomerId,
			startDate: new Date(),
			endDate,
			totalPrice,
			status: 'confirmed',
		});
		await bookingData.save();

		const updatedCarData = await Car.findById(carId).lean();
		const updatedCustomerData = await Customer.findById(
			currentCustomerId
		).lean();

		// start date & end date
		let formatedStartDate =
			bookingData.startDate.toLocaleDateString() +
			' ' +
			bookingData.startDate.toLocaleTimeString();

		let formatedEndDate =
			bookingData.endDate.toLocaleDateString() +
			' ' +
			bookingData.endDate.toLocaleTimeString();

		//socket.io functionality
		const othersockets = Object.keys(userSockets).filter(
			(id) => id !== currentCustomerId
		);
		// console.log('othersockets', othersockets);

		othersockets.forEach((id) => {
			// console.log('id', id);
			io.to(userSockets[id]).emit('car-booked', {
				carData: { ...formatCarData(updatedCarData) },
				currentCustomer: updatedCustomerData.name,
				totalPrice,
				startDate: formatedStartDate,
				endDate: formatedEndDate,
			});
		});

		console.log('updatedCarData', updatedCarData.location.coordinates);
		// send mail to the user
		const mailOptions = {
			from: process.env.EMAIL,
			to: updatedCustomerData.email,
			subject: 'Car Booked',
			text: `You have successfully booked ${updatedCarData.model} from ${formatedStartDate} to ${formatedEndDate}.\n Total Price: ${totalPrice}. \nLocation of the car: [${updatedCarData.location.coordinates[0]}, ${updatedCarData.location.coordinates[1]}]. \nThank you for using our service.`,
		};

		await transporter.sendMail(mailOptions);
		console.log(
			'Booking confirmation email sent to:',
			updatedCustomerData.email
		);

		// sent mail to admin
		const adminMailOptions = {
			from: process.env.EMAIL,
			to: process.env.ADMIN_EMAIL,
			subject: 'Car Booked',
			text: `Car ${updatedCarData.model} has been booked by ${updatedCustomerData.name} from ${formatedStartDate} to ${formatedEndDate}.\n Total Price: ${totalPrice}. \nLocation of the car: [${updatedCarData.location.coordinates[0]}, ${updatedCarData.location.coordinates[1]}].`,
		};

		await transporter.sendMail(adminMailOptions);
		console.log('Booking confirmation email sent to:', process.env.ADMIN_EMAIL);

		return res.json({
			carData: { ...formatCarData(updatedCarData) },
			currentCustomer: updatedCustomerData.name,
			totalPrice,
			startDate: formatedStartDate,
			endDate: formatedEndDate,
		});
	} catch (error) {
		console.error('Error booking car: ', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/api/cars/rate', async (req, res) => {
	const { carId, rating } = req.body;

	if (!carId || !rating) {
		return res.status(400).json({ error: 'Invalid input data' });
	}

	try {
		const carData = await Car.findById(carId);
		if (!carData) {
			return res.status(404).json({ error: 'Car not found' });
		}

		// Update car rating
		carData.ratings.push({
			customerId: currentCustomerId,
			rating,
		});

		carData.averageRating = carData.ratings.reduce(
			(sum, rating) => sum + rating.rating,
			0
		);

		carData.averageRating /= carData.ratings.length;

		await carData.save();

		return res.json({
			carData: { ...formatCarData(carData) },
			rating: carData.averageRating,
		});
	} catch (error) {
		console.error('Error rating car: ', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/api/cars/cancel', async (req, res) => {
	const { carId } = req.body;

	if (!carId) {
		return res.status(400).json({ error: 'Invalid input data' });
	}

	const carData = await Car.findById(carId);

	if (!carData) {
		return res.status(404).json({ error: 'Car not found' });
	}

	if (
		carData.status === 'booked' &&
		carData.currentCustomerId == currentCustomerId
	) {
		const findBookingData = await Booking.findOne({
			carId: carData._id,
			customerId: currentCustomerId,
			status: 'confirmed',
		});

		if (!findBookingData) {
			return res.status(404).json({ error: 'Booking not found' });
		}

		findBookingData.status = 'pending cancellation';
		await findBookingData.save();

		// send email to the admin
		const adminMailOptions = {
			from: process.env.EMAIL,
			to: process.env.ADMIN_EMAIL,
			subject: 'Booking Cancellation Request',
			text: `Customer has requested to cancel the booking of ${carData.name} from ${findBookingData.startDate} to ${findBookingData.endDate}.`,
		};

		await transporter.sendMail(adminMailOptions);
		console.log('Booking cancellation email sent to:', process.env.ADMIN_EMAIL);

		return res.json({ message: 'Booking cancellation requested' });
	}

	return res.status(404).json({ error: 'Car not booked' });
});

export default router;
