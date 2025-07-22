import { useEffect, useState } from "react";import Sidebar from "../components/Sidebar";
import SignaturePad from "../components/SignaturePad";
import api from "../assets/api";
import { getUserIdFromToken } from "../utils/auth";

function Signatures() {
	const [userName, setUserName] = useState("");

	useEffect(() => {
		const userData = localStorage.getItem("userData");
		let access = localStorage.getItem("access");

		if (!access && userData) {
			try {
				access = JSON.parse(userData)?.access;
			} catch (err) {
				console.error("Failed to parse userData:", err);
			}
		}

		const userId = getUserIdFromToken(access);

		if (!access || !userId) {
			console.error("Access token or user ID is missing.");
			return;
		}

		api
			.get(`/api/user/${userId}/`, {
				headers: {
					Authorization: `Bearer ${access}`,
				},
			})
			.then((response) => {
				setUserName(response.data.first_name || response.data.username || "User");
			})
			.catch((error) => {
				console.error("Failed to fetch user:", error);
			});
	}, []);

	return (
		<div>
			<Sidebar />
			<div className="ml-72 pt-8">
				<div className="flex flex-row items-center justify-between mx-8 my-8">
					<p className="font-bold text-2xl">Customize Your Signature, {userName}</p>
				</div>
				<SignaturePad />
			</div>
		</div>
	);
}

export default Signatures;
