import { useEffect, useState } from "react";
import api from "../../assets/api";
const BASE_URL = import.meta.env.VITE_API_URL;

function Programs({ program, studentId }) {
	const [status, setStatus] = useState("Loading...");
	const [signatureImage, setSignatureImage] = useState(null);
	useEffect(() => {
		const fetchSignatureStatus = async () => {
			try {
				const res = await api.get(`/api/clearance-signatures/status/${studentId}/${program.id}/`);
				if (res.data.status) {
					setStatus(res.data.status);

					// If approved and image is present, set signature image
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
		try {
			const response = await api.post(`/api/clearance-signatures/create/${studentId}/${program.id}/`, {
				status: "Pending",
				feedback: "Request sent from student",
			});
			alert("Request sent successfully!");
			setStatus(`Status: ${response.data.status}`);
		} catch (error) {
			alert(error, "Failed to send request.");
		}
	};

	return (
		<div className="">
			<div className="flex flex-row items-center space-x-2">
				<div className="font-bold text-sm md:text-lg text-green-900 w-96">{program.program_name}</div>
				<div className="w-full font-bold text-lg text-green-700 flex flex-row">
					:
					<p className="flex-1 border-b border-black text-red-400 pl-1 md:pl-8 relative">
						{status === "Approved" && signatureImage ? (
							<img
								src={signatureImage}
								alt="Signature"
								draggable='false'
								className="w-44 h-auto absolute -top-10 left-0"
							/>
						) : (
							<>
								<span>Status: {status}</span>
								{status === "No signature yet" && (
									<button
										onClick={handleSendRequest}
										className="text-white bg-green-600 px-2 rounded-sm text-sm ml-8">
										Send Request
									</button>
								)}
							</>
						)}
					</p>
				</div>
			</div>
		</div>
	);
}

export default Programs;
