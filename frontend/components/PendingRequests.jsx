import { useMemo, useEffect, useState } from 'react';
import axios from 'axios';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useOutletContext } from 'react-router-dom';
// import PropTypes from 'prop-types';

const PendingRequestTable = () => {
	const { setData } = useOutletContext();
	const [bookingData, setBookingData] = useState([]);

	useEffect(() => {
		axios
			.get(
				'http://localhost:3000/admin/api/bookings?status=pending+cancellation'
			)
			.then((response) => {
				setBookingData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
			});
	}, []);

	// console.log('data in PendingRequestTable', data);

	// Approve a booking request
	const approveBooking = async (bookingId) => {
		await axios
			.post(`http://localhost:3000/admin/api/bookings/approve`, {
				bookingId,
				status: 'cancelled',
			})
			.then((response) => {
				console.log('Booking Cancelled: ', response.data);
				const bookingData = response.data.bookingData;
				const updatedCarData = response.data.updatedCarData;

				setData((prevData) =>
					prevData.map((car) =>
						car.id === updatedCarData.id ? updatedCarData : car
					)
				);

				setBookingData((prevData) =>
					prevData.map((booking) =>
						booking._id === bookingData._id ? bookingData : booking
					)
				);
			})
			.catch((error) => {
				console.error('Error approving booking cancellation: ', error);
			});
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: '_id',
				header: 'Booking ID',
			},
			{
				accessorKey: 'carId',
				header: 'Car ID',
			},
			{
				accessorKey: 'customerId',
				header: 'Customer ID',
			},
			{
				accessorKey: 'startDate',
				header: 'Start Date',
			},
			{
				accessorKey: 'endDate',
				header: 'End Date',
			},
			{
				accessorKey: 'totalPrice',
				header: 'Total Price',
			},
			{
				accessorKey: 'rating',
				header: 'Rating',
			},
			{
				accessorKey: 'status',
				header: 'Status',
			},
		],
		[]
	);

	// Approve action
	const openApproveConfirmModal = (row) => {
		if (window.confirm('Are you sure you want to approve this booking?')) {
			approveBooking(row.original._id);
		}
	};

	const table = useMaterialReactTable({
		columns,
		data: bookingData,
		enableEditing: true,
		getRowId: (row) => row._id,
		muiTableContainerProps: {
			sx: {
				minHeight: '500px',
			},
		},
		renderRowActions: ({ row }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title="Approve">
					<IconButton
						color="primary"
						onClick={() => openApproveConfirmModal(row)}>
						<CheckCircleIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
	});

	return <MaterialReactTable table={table} />;
};

export default PendingRequestTable;
