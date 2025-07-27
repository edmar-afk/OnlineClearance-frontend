import { useEffect, useState } from "react";import Sidebar from "../../components/Sidebar";
import { getUserIdFromToken } from "../../utils/auth";
import api from "../../assets/api";
import SignatureRequestsTable from "./SignatureRequestsTable";

function SignatureRequests() {
	const [userInfo, setUserInfo] = useState(null);
	const [staffId, setStaffId] = useState(null);

	useEffect(() => {
		const access = localStorage.getItem("access");
		const userId = getUserIdFromToken(access);

		if (!access || !userId) {
			console.error("Access token or user ID is missing.");
			return;
		}

		setStaffId(userId);

		api
			.get(`/api/user/${userId}/`, {
				headers: {
					Authorization: `Bearer ${access}`,
				},
			})
			.then((response) => {
				console.log("User Info:", response.data);
				setUserInfo(response.data);
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
					<p className="font-bold text-xl">
						Accept Students' Signature Requests here, {userInfo?.first_name || "User"}
					</p>
				</div>
				{staffId && userInfo && (
					<SignatureRequestsTable
						staffId={staffId}
						staffProgram={userInfo.first_name}
						course={userInfo.last_name}
						isSuperUser={userInfo.is_superuser}
					/>
				)}
			</div>
		</>
	);
}

export default SignatureRequests;
