import { Schema, model } from 'mongoose';
import Customer from './customer.model.js';

const bookingSchema = new Schema(
	{
		carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		status: {
			type: String,
			enum: [
				'pending',
				'confirmed',
				'inProgress',
				'completed',
				'cancelled',
				'pending cancellation',
			],
			default: 'pending',
		},
		totalPrice: { type: Number, required: true },
		cancellationReason: String,
		rating: { type: Number, min: 1, max: 5 },
	},
	{ timestamps: true }
);

bookingSchema.post('findOneAndDelete', async function (doc) {
	const findCustomerData = await Customer.find({ _id: doc._id });

	if (findCustomerData.length === 0) {
		console.log('Deleted customer:', doc._id);
		return;
	}

	const promise = Promise.all(
		findCustomerData.map(async (customer) => {
			const findCustomer = await Customer.findOne({ _id: customer._id });
			const bookings = findCustomer.bookings.filter(
				(booking) => booking.toString() !== doc._id.toString()
			);
			findCustomer.bookings = bookings;
			await findCustomer.save();
		})
	);

	await promise;

	console.log('Bookings of customers are deleted');
	return;
});

const Booking = model('Booking', bookingSchema);

export default Booking;
