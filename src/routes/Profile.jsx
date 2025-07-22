import StudentProfile from "./students/StudentProfile";
import Sidebar from "../components/Sidebar";
function Profile() {
	return (
		<>
			<Sidebar />
			<div className="ml-72 pt-8">
				<StudentProfile />
			</div>
		</>
	);
}

export default Profile;
