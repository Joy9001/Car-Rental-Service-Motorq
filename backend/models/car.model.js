import { Schema, model } from 'mongoose';
import Booking from './booking.model.js';

const carSchema = new Schema(
	{
		registrationNumber: { type: String, required: true, unique: true },
		make: { type: String, required: true },
		model: { type: String, required: true },
		year: { type: Number, required: true },
		rentRate: {
			daily: { type: String, required: true },
			hourly: { type: String, required: true },
		},
		location: {
			type: { type: String, default: 'Point' },
			coordinates: [Number],
		},
		status: {
			type: String,
			enum: ['available', 'booked', 'inTrip', 'maintenance'],
			default: 'available',
		},
		fuelType: { type: String, required: true },
		currentCustomerId: {
			type: Schema.Types.ObjectId,
			ref: 'Customer',
			default: null,
		},
		ratings: [
			{
				customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
				rating: { type: Number, min: 1, max: 5 },
				comment: String,
			},
		],
		averageRating: { type: Number, default: 0 },
		image: { type: String },
	},
	{
		timestamps: true,
	}
);

carSchema.index({ location: '2dsphere' });

carSchema.post('findOneAndDelete', async function (doc) {
	console.log(doc);

	const findBookingData = await Booking.find({ carId: doc._id });

	if (findBookingData.length === 0) {
		console.log('Deleted car:', doc._id);
		return;
	}

	const promise = Promise.all(
		findBookingData.map(async (booking) => {
			await Booking.findOneAndDelete({ _id: booking._id });
		})
	);

	await promise;

	console.log('Deleted bookings for car:', doc._id);
	return;
});

const Car = model('Car', carSchema);

export default Car;
