import { useEffect, useState } from "react";import api from "../../assets/api";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

function Programs({ program, studentId }) {
	const [status, setStatus] = useState("Loading...");
	const [signatureImage, setSignatureImage] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSignatureStatus = async () => {
			try {
				const res = await api.get(`/api/clearance-signatures/status/${studentId}/${program.id}/`);
				if (res.data.status) {
					setStatus(res.data.status);
					if (res.data.status === "Approved" && res.data.signature?.image) {
						setSignatureImage(`${BASE_URL}${res.data.signature.image}`);
					}
				} else {
					setStatus("No signature yet");
				}
			} catch (err) {
				console.error(err);
				setStatus("No signature yet");
			}
		};
		fetchSignatureStatus();
	}, [studentId, program.id]);

	const handleSendRequest = async () => {
		setLoading(true);
		try {
			const response = await api.post(`/api/clearance-signatures/create/${studentId}/${program.id}/`, {
				status: "Pending",
				feedback: "Request sent from student",
			});
			Swal.fire({
				icon: "success",
				title: "Success",
				text: "Request sent successfully!",
			});
			setStatus(`Status: ${response.data.status}`);
		// eslint-disable-next-line no-unused-vars
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Failed",
				text: "Failed to send request.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="flex flex-row items-center space-x-2">
				<div className="font-bold text-sm md:text-lg text-green-900 w-96">{program.program_name}</div>
				<div className="w-full font-bold text-lg text-green-700 flex flex-row">
					:
					<div className="flex-1 border-b border-black text-red-400 pl-1 md:pl-8 relative">
						{status === "Approved" && signatureImage ? (
							<img
								src={signatureImage}
								alt="Signature"
								draggable="false"
								className="w-44 h-auto absolute -top-10 left-0"
							/>
						) : (
							<>
								<div className="flex flex-row">
									<span>{status}</span>
									{status === "No signature yet" && (
										<button
											onClick={handleSendRequest}
											disabled={loading}
											className={`text-white bg-green-600 px-2 rounded-sm text-sm ml-8 flex items-center space-x-2 ${
												loading ? "opacity-70 cursor-not-allowed" : ""
											}`}>
											{loading ? (
												<>
													<CircularProgress
														size={16}
														color="inherit"
													/>
													<span className="ml-2">Please wait...</span>
												</>
											) : (
												"Send Request"
											)}
										</button>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Programs;
