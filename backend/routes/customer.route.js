import { Router } from 'express';
import Car from '../models/car.model.js';
import Customer from '../models/customer.model.js';
import Booking from '../models/booking.model.js';
import { formatCarData, deformatCarData } from '../helpers/fomatData.js';
import currentCustomerId from '../helpers/currentCustomer.js';
const router = Router();

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

		if (carData.status === 'available') {
			await Car.findByIdAndUpdate(carId, {
				status: 'booked',
				currentCustomerId: currentCustomerId,
			});
		}

		// Calculate end date and total price
		let endDate = new Date();
		let totalPrice = 0;

		if (dailyDuration) {
			endDate.setDate(endDate.getDay() + parseInt(dailyDuration));
			totalPrice = parseFloat(carData.rentRate.daily) * parseInt(dailyDuration);
		} else if (hourlyDuration) {
			endDate.setHours(endDate.getHours() + parseInt(hourlyDuration));
			totalPrice =
				parseFloat(carData.rentRate.hourly) * parseFloat(hourlyDuration);
		}

		console.log(totalPrice);
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

		return res.json({
			carData: { ...formatCarData(updatedCarData) },
			currentCustomer: updatedCustomerData.name,
			totalPrice,
			startDate:
				bookingData.startDate.toLocaleDateString() +
				' ' +
				bookingData.startDate.toLocaleTimeString(),
			endDate:
				bookingData.endDate.toLocaleDateString() +
				' ' +
				bookingData.endDate.toLocaleTimeString(),
		});
	} catch (error) {
		console.error('Error booking car: ', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
