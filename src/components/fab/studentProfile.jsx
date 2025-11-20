import React, { useState } from "react";
import { Modal, Box, Typography, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function StudentProfile({ info }) {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Tooltip
				title="Your Profile"
				arrow
				placement="right">
				<button
					onClick={handleOpen}
					className="fixed left-6 bottom-20 bg-white p-3 rounded-full shadow-2xl cursor-pointer group hover:bg-green-500 duration-300 hover:scale-115">
					<PersonIcon
						fontSize="medium"
						className="text-blue-500 group-hover:text-white"
					/>
				</button>
			</Tooltip>

			<Modal
				open={open}
				onClose={handleClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
						width: 300,
					}}>
					<Typography
						variant="h6"
						gutterBottom>
						Student Information
					</Typography>
					<Typography>Name: {info.user.first_name}</Typography>
					<Typography>ID: {info.user.id}</Typography>
					<Typography>Course: {info.year_level}</Typography>
					<Typography>Year: {info.user.last_name}</Typography>
					<Typography>Email: {info.user.email}</Typography>
				</Box>
			</Modal>
		</>
	);
}

export default StudentProfile;
