import { Router } from 'express';
import Car from '../models/car.model.js';
import { formatCarData, deformatCarData } from '../helpers/fomatData.js';

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

export default router;
