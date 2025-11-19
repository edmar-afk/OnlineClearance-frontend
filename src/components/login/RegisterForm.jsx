import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import userImg from "../../assets/images/user.png";
import padlock from "../../assets/images/padlock.png";
import api from "../../assets/api";
import cyberian from "../../assets/images/club_logo/cyberian.jpg";
import iron from "../../assets/images/club_logo/iron.jpg";
import schoolYear from "../../assets/images/schoolYear.png";
import major from "../../assets/images/major.png";
function RegisterForm({ onToggle }) {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
		first_name: "",
		last_name: "BSIT",
		year_level: "First Year",
		major: "",
	});
	const [repeatPassword, setRepeatPassword] = useState("");
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	const [courseImage, setCourseImage] = useState(cyberian);

	const navigate = useNavigate();

	const courseImages = {
		BSIT: cyberian,
		BIT: iron,
		"BTVTED-FSM": iron,
		"BTVTED-AP": "https://via.placeholder.com/20?text=AP",
		BTLED: "https://via.placeholder.com/20?text=BTLED",
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "email") {
			setFormData((prev) => ({
				...prev,
				email: value,
				username: value,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}

		if (name === "last_name") {
			setCourseImage(courseImages[value]);
		}
	};

	const handleRepeatPasswordChange = (e) => {
		setRepeatPassword(e.target.value);
		setPasswordMismatch(e.target.value !== formData.password);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password !== repeatPassword) {
			setPasswordMismatch(true);
			return;
		}

		Swal.fire({
			title: "Registering...",
			text: "Please wait while we create your account.",
			allowOutsideClick: false,
			showConfirmButton: false,
			background: "#ffffffdd",
			backdrop: `rgba(0, 0, 0, 0.4) blur(6px)`,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			await api.post("/api/register/", formData);

			Swal.fire({
				icon: "success",
				title: "Account Created!",
				showConfirmButton: true,
				confirmButtonText: "Go to Login",
				confirmButtonColor: "#15803d",
				background: "#ffffffdd",
				backdrop: `rgba(0, 0, 0, 0.4) blur(6px)`,
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("/login");
				}
			});
		} catch (error) {
			const errMsg =
				error.response?.data?.username?.[0] ||
				error.response?.data?.email?.[0] ||
				error.response?.data?.password?.[0] ||
				"Registration failed. Please try again.";

			Swal.fire({
				icon: "error",
				title: "Error",
				text: errMsg,
				confirmButtonColor: "#dc2626",
				background: "#ffffffdd",
				backdrop: `rgba(0, 0, 0, 0.4) blur(12px)`,
			});
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto mb-4 max-w-sm pb-4">
			<div className="relative">
				<img
					src={userImg}
					alt=""
					className="absolute left-4 top-4 w-5 h-5"
				/>
				<input
					type="email"
					name="email"
					placeholder="Email Address"
					value={formData.email}
					onChange={handleChange}
					required
					className="block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
				/>
				<p className="mb-4 text-xs text-orange-700 text-left mt-1">
					An incorrect email address will prevent you from receiving notifications and may result in critical errors.
				</p>
			</div>

			<div className="relative">
				<img
					src={userImg}
					alt=""
					className="absolute left-4 top-4 w-5 h-5"
				/>
				<input
					type="text"
					name="first_name"
					placeholder="Full Name (Last Name, First Name)"
					value={formData.first_name}
					onChange={handleChange}
					required
					className="block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
				/>
				<p className="mb-4 text-xs text-orange-700 text-left mt-1">
					Providing an invalid full name may lead to immediate disqualification from clearance.
				</p>
			</div>

			<div className="relative">
				<img
					src={courseImage}
					alt=""
					className="absolute left-2 top-3 w-8 h-8"
				/>
				<select
					name="last_name"
					value={formData.last_name}
					onChange={handleChange}
					required
					className="mb-4 block w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333]">
					<option value="BSIT">BSIT</option>
					<option value="BIT">BIT</option>
					<option value="BTED-FSM">BTED-FSM</option>
					<option value="BTLED-AP">BTLED-AP</option>
					<option value="BTLED-HE">BTLED-HE</option>
				</select>
			</div>
			<div className="relative">
				<img
					src={schoolYear}
					alt=""
					className="absolute left-3 top-4 w-6 h-6"
				/>
				<select
					name="year_level"
					value={formData.year_level}
					onChange={handleChange}
					required
					className="mb-4 block w-full border border-black bg-[#f2f2f7] px-3 py-4 pl-14 text-sm text-[#333333]">
					<option value="First Year">First Year</option>
					<option value="Second Year">Second Year</option>
					<option value="Third Year">Third Year</option>
					<option value="Fourth Year">Fourth Year</option>
				</select>
			</div>

			<div className="relative">
				<img
					src={major}
					alt=""
					className="absolute left-3 top-3 w-6 h-6"
				/>
				<input
					type="text"
					name="major"
					placeholder="Major (optional)"
					value={formData.major}
					onChange={handleChange}
					className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
				/>
			</div>

			<div className="relative mb-4">
				<img
					src={padlock}
					alt=""
					className="absolute left-4 top-4 w-5 h-5"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={formData.password}
					onChange={(e) => {
						handleChange(e);
						setPasswordMismatch(e.target.value !== repeatPassword);
					}}
					required
					className={`mb-2 block h-9 w-full border ${
						passwordMismatch ? "border-red-500" : "border-black"
					} bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]`}
				/>
			</div>

			<div className="relative mb-2">
				<img
					src={padlock}
					alt=""
					className="absolute left-4 top-4 w-5 h-5"
				/>
				<input
					type="password"
					name="repeatPassword"
					placeholder="Repeat Password"
					value={repeatPassword}
					onChange={handleRepeatPasswordChange}
					required
					className={`block h-9 w-full border ${
						passwordMismatch ? "border-red-500" : "border-black"
					} bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]`}
				/>
				{passwordMismatch && <p className="text-sm text-red-500 mt-1">Passwords do not match.</p>}
			</div>

			<button
				type="submit"
				className="flex items-center w-full hover:scale-105 duration-300 cursor-pointer justify-center bg-green-700 px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]">
				<p className="mr-6 font-bold">Register</p>
				<svg
					className="h-4 w-4 flex-none"
					fill="currentColor"
					viewBox="0 0 20 21">
					<title>Arrow Right</title>
					<polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9" />
				</svg>
			</button>

			<p className="mt-4 text-sm text-[#647084] text-left">
				Already have an account?{" "}
				<span
					onClick={onToggle}
					className="text-green-700 font-bold hover:underline cursor-pointer">
					Login here
				</span>
			</p>
		</form>
	);
}

export default RegisterForm;
