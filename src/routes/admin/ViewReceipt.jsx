import { useState } from "react";import { Modal, Box, IconButton } from "@mui/material";import CloseIcon from "@mui/icons-material/Close";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 2,
	borderRadius: 2,
	maxWidth: "90vw",
	maxHeight: "90vh",
	outline: "none",
};

function ViewReceipt({ name, program, yearLvl, course, imageUrl }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition">
				View Receipt
			</button>

			<Modal
				open={open}
				onClose={() => setOpen(false)}>
				<Box sx={style}>
					<div className="absolute left-8 top-8 bg-white w-72 rounded-md px-3 py-3">
						{" "}
						{name} from {course} has sent a receipt for <b>{program}</b>.
					</div>
					<div className="absolute right-8 top-8 bg-white hover:bg-red-400 duration-300 hover:scale-110 rounded-full">
						<IconButton
							onClick={() => setOpen(false)}
							sx={{
								color: "red",
								"&:hover": {
									color: "white",
								},
							}}>
							<CloseIcon />
						</IconButton>
					</div>
					<img
						src={imageUrl}
						alt="Receipt"
						className="max-w-full max-h-[75vh] rounded"
					/>
				</Box>
			</Modal>
		</>
	);
}

export default ViewReceipt;
