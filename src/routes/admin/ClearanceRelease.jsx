import { useEffect, useState } from "react";import Sidebar from "../../components/Sidebar";
import Stats from "../../components/Stats";
import { getUserIdFromToken } from "../../utils/auth";
import api from "../../assets/api";
import ClearanceTable from "./ClearanceTable";

function ClearanceRelease() {
	const [userName, setUserName] = useState("");

	useEffect(() => {
		const access = localStorage.getItem("access");
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
				console.log("User Info:", response.data);
				setUserName(response.data.first_name || response.data.username || "User");
			})
			.catch((error) => {
				console.error("Failed to fetch user:", error);
			});
	}, []);

	return (
		<>
			<Sidebar />
			<div className="ml-72 pt-8 mr-8">
				<div className="flex flex-row items-center justify-between mx-8 my-8">
					<p className="font-bold text-xl">Release the Clearance here. {userName}</p>
				</div>
				<ClearanceTable />
			</div>
		</>
	);
}

export default ClearanceRelease;
