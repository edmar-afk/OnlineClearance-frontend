import { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import api from "../../assets/api";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "background.paper",
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
};

function ViewClearance({ clearanceId }) {
	const [open, setOpen] = useState(false);
	const [clearance, setClearance] = useState(null);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		if (open && clearanceId) {
			api
				.get(`/api/clearances/${clearanceId}/`)
				.then((res) => setClearance(res.data))
				.catch((err) => console.error("Failed to fetch clearance:", err));
		}
	}, [open, clearanceId]);

	return (
		<>
			<button
				className="text-blue-600 mr-1 cursor-pointer hover:scale-110 duration-300 hover:text-blue-900"
				onClick={handleOpen}>
				<RemoveRedEyeIcon/>
			</button>

			<Modal
				open={open}
				onClose={handleClose}>
				<Box sx={style}>
					<Typography
						variant="h6"
						mb={2}>
						Clearance Details
					</Typography>

					{clearance ? (
						<div>
							<p>
								<strong>Academic Year:</strong> {clearance.academic_year}
							</p>
							<p>
								<strong>Semester:</strong> {clearance.semester}
							</p>
							<p>
								<strong>Created At:</strong> {new Date(clearance.created_at).toLocaleString()}
							</p>
							<p>
								<strong>Updated At:</strong> {new Date(clearance.updated_at).toLocaleString()}
							</p>
							<p>
								<strong>Programs:</strong>
							</p>
							<ul>
								{clearance.programs.map((program) => (
									<li key={program.id}>{program.program_name}</li>
								))}
							</ul>
							<Button
								variant="contained"
								onClick={handleClose}
								sx={{ mt: 2 }}>
								Close
							</Button>
						</div>
					) : (
						<p>Loading...</p>
					)}
				</Box>
			</Modal>
		</>
	);
}

export default ViewClearance;
