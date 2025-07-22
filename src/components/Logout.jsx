import { useEffect } from "react";import { useNavigate } from "react-router-dom";

function Logout() {
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.clear(); // or removeItem("yourToken") if you want specific
		navigate("/", { replace: true });
	}, [navigate]);

	return null; // no UI needed
}

export default Logout;
