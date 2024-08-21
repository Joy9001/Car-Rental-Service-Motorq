import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [userId, setUserId] = useState(null);
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		console.log('params', params);
		const id = params.get('id');
		if (id) {
			setUserId(id);
		}
	}, [location]);

	return (
		<UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
	);
};

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useUser = () => useContext(UserContext);
