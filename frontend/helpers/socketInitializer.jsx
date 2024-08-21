import { useEffect } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
// import { useUser } from './currentUserContext.jsx';

const SocketInitializer = ({ setData }) => {
	const url = window.location.href;
	const userId = url.split('id=')[1];
	console.log('userId', userId);

	useEffect(() => {
		if (userId) {
			const socket = io('http://localhost:3000', {
				query: {
					customerId: userId,
				},
			});

			// car booked
			socket.on(
				'car-booked',
				({ carData, currentCustomer, totalPrice, startDate, endDate }) => {
					setData((prevData) => {
						const updatedData = prevData.map((car) => {
							if (car.id === carData.id) {
								return {
									...carData,
									currentCustomer,
									totalPrice,
									startDate,
									endDate,
								};
							}
							return car;
						});
						return updatedData;
					});
				}
			);

			socket.on('connect', () => {
				console.log('Connected to socket server');
			});

			return () => {
				socket.disconnect();
			};
		}
	}, [userId, setData]);

	return null;
};

SocketInitializer.propTypes = {
	data: PropTypes.array.isRequired,
	setData: PropTypes.func.isRequired,
};

export default SocketInitializer;
