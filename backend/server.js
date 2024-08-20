import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { Server } from 'socket.io';
import connectMongo from './db/connectMongo.db.js';
import morgan from 'morgan';
import cors from 'cors';
import AdminRouter from './routes/admin.route.js';
import CustomerRouter from './routes/customer.route.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const io = new Server(server, {
	cors: {
		origin: [process.env.DOMAIN, 'https://admin.socket.io'],
		methods: ['GET', 'POST'],
		credentials: false,
	},
});

// logger
app.use(morgan('dev'));

//cors
app.use(cors());

app.use(express.json());

app.use('/admin', AdminRouter);
app.use('/customer', CustomerRouter);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

let userSocket = {};

io.on('connection', (socket) => {
	const customerId = socket.handshake.query.customerId;
	if (customerId) {
		userSocket[customerId] = socket.id;
	}
	console.log('a user connected', socket.id);
	socket.on('disconnect', () => {
		console.log('user disconnected', socket.id);
	});
});

server.listen(PORT, async () => {
	try {
		await connectMongo().then(() => {
			console.log('MongoDB connected');
			console.log(
				`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
			);
		});
	} catch (error) {
		console.log('Error connecting to MongoDB: ', error.message);
	}
});
