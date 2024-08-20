import { Schema, model } from 'mongoose';

const customerSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String },
		dlImage: { type: String },
		bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
	},
	{ timestamps: true }
);

const Customer = model('Customer', customerSchema);

export default Customer;
