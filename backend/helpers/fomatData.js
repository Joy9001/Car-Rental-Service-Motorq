const formatCarData = (car) => {
	return {
		id: car._id,
		registrationNumber: car.registrationNumber,
		make: car.make,
		model: car.model,
		year: car.year,
		rentratedaily: car.rentRate.daily,
		rentratehourly: car.rentRate.hourly,
		location: (
			car.location.coordinates[0] +
			',' +
			car.location.coordinates[1]
		).toString(),
		status: car.status,
		fueltype: car.fuelType,
		currentCustomerId: car.currentCustomerId,
		averageRating: car.averageRating,
		image: car.image,
	};
};

const deformatCarData = (car) => {
	return {
		registrationNumber: car.registrationNumber,
		make: car.make,
		model: car.model,
		year: car.year,
		rentRate: {
			daily: car.rentratedaily,
			hourly: car.rentratehourly,
		},
		location: {
			type: 'Point',
			coordinates: car.location.split(',').map(Number),
		},
		status: car.status,
		fuelType: car.fueltype,
		currentCustomerId: car.currentCustomerId,
		averageRating: car.averageRating,
		image: car.image,
	};
};

export { formatCarData, deformatCarData };
