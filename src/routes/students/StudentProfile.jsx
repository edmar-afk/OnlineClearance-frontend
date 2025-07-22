import { useEffect, useState } from "react";import api from "../../assets/api";
import { getUserIdFromToken } from "../../utils/auth";

function StudentProfile() {
	const [studentData, setStudentData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUserData = localStorage.getItem("userData");

		if (storedUserData) {
			const { access } = JSON.parse(storedUserData);
			const userId = getUserIdFromToken(access);
			console.log("User ID:", userId);

			api
				.get(`/api/student/${userId}/`)
				.then((response) => {
					console.log("Student Info:", response.data);
					setStudentData(response.data);
				})
				.catch((error) => {
					console.error("Error fetching student data:", error);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			console.log("No userData found in localStorage.");
			setLoading(false);
		}
	}, []);

	if (loading) return <p>Loading...</p>;
	if (!studentData) return <p>No student data found.</p>;

	return (
		<div className="p-4 bg-white rounded shadow max-w-md">
			<h2 className="text-xl font-bold mb-4">Student Profile</h2>
			<p>
				<strong>Username:</strong> {studentData.user.username}
			</p>
			<p>
				<strong>Email:</strong> {studentData.user.email}
			</p>
			<p>
				<strong>Full Name:</strong> {studentData.user.first_name} {studentData.user.last_name}
			</p>
			<p>
				<strong>Year Level:</strong> {studentData.year_level}
			</p>
			<p>
				<strong>Major:</strong> {studentData.major || "N/A"}
			</p>
		</div>
	);
}

export default StudentProfile;
