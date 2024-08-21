import './App.css';
import { Outlet } from 'react-router-dom';
import SocketInitializer from '../helpers/socketInitializer.jsx';
import { useState } from 'react';

function App() {
	const [data, setData] = useState([]);

	return (
		<>
			<SocketInitializer data={data} setData={setData} />
			<Outlet context={{ data, setData }} />
		</>
	);
}

export default App;
