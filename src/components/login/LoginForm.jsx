import { useState } from "react";import Swal from "sweetalert2";import { useNavigate } from "react-router-dom";
import api from "../../assets/api";
import userImg from "../../assets/images/user.png";
import padlock from "../../assets/images/padlock.png";
import { getUserIdFromToken } from "../../utils/auth";
function LoginForm({ onToggle }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		Swal.fire({
			title: "Logging in...",
			backdrop: true,
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			const response = await api.post("/api/login/", {
				username: email,
				password: password,
			});

			const { access, refresh } = response.data;

			localStorage.setItem("access", access);
			localStorage.setItem("refresh", refresh);

			const userId = getUserIdFromToken(access);

			// 🔥 Fetch full user data
			const userRes = await api.get(`/api/user/${userId}/`, {
				headers: {
					Authorization: `Bearer ${access}`,
				},
			});

			const userData = userRes.data;
			localStorage.setItem("userData", JSON.stringify(userData));

			Swal.fire({
				icon: "success",
				title: "Login Successful",
				text: "Redirecting...",
				confirmButtonColor: "#16a34a",
			});

			if (userData.is_staff && userData.is_superuser) {
				navigate("/dashboard");
			} else {
				navigate("/student-clearance");
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: "error",
				title: "Login Failed",
				text: "Invalid email or password",
				confirmButtonColor: "#dc2626",
			});
		}
	};


	return (
		<form
			className="mx-auto mb-4 max-w-sm pb-4"
			onSubmit={handleSubmit}
			name="wf-form-password"
			autoComplete="on"
			method="post">
			<div className="relative">
				<img
					alt=""
					src={userImg}
					className="absolute bottom-0 left-4 top-4 w-5 h-5"
				/>
				<input
					type="text"
					autoComplete="email"
					className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
					maxLength="256"
					placeholder="Email Address"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="relative mb-4">
				<img
					alt=""
					src={padlock}
					className="absolute bottom-0 left-4 top-4 w-5 h-5"
				/>
				<input
					type="password"
					className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
					placeholder="Password (min 8 characters)"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			<button
				type="submit"
				className="flex w-full items-center justify-center bg-green-700 px-8 py-4 font-semibold text-white transition hover:scale-105 duration-300 [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]">
				<p className="mr-6 font-bold">Login</p>
				<svg
					className="h-4 w-4 flex-none"
					fill="currentColor"
					viewBox="0 0 20 21"
					xmlns="http://www.w3.org/2000/svg">
					<title>Arrow Right</title>
					<polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9" />
				</svg>
			</button>

			<p className="mt-4 text-sm text-[#647084] text-left">
				Don't have an account?{" "}
				<span
					onClick={onToggle}
					className="text-green-700 font-bold hover:underline cursor-pointer">
					Register here
				</span>
			</p>
		</form>
	);
}

export default LoginForm;
