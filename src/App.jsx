import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./routes/admin/Dashboard";
import Signature from "./routes/Signatures";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./routes/Profile";
import StudentClearance from "./routes/students/StudentClearance";
import ClearanceRelease from './routes/admin/ClearanceRelease'
import ClearanceRequest from "./routes/admin/ClearanceRequest";
import SignatureRequests from "./routes/admin/SignatureRequests";
import CompletedClearance from "./routes/admin/CompletedClearance";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Login />}
				/>
				<Route
					path="/dashboard"
					element={<Dashboard />}
				/>
				<Route
					path="/signature"
					element={<Signature />}
				/>
				<Route
					path="/profile"
					element={<Profile />}
				/>
				<Route
					path="/release-clearance"
					element={<ClearanceRelease />}
				/>
				<Route
					path="/request-clearance"
					element={<ClearanceRequest />}
				/>
				<Route
					path="/request-signature"
					element={<SignatureRequests/>}
				/>
				<Route
					path="/student-clearance"
					element={<StudentClearance />}
				/>
				<Route
					path="/completed-clearance"
					element={<CompletedClearance />}
				/>
				<Route
					path="/logout"
					element={<Logout />}
				/>
				<Route
					path="*"
					element={<Navigate to="/" />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
