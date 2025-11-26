import { Link } from "react-router-dom";
import StudentProfile from "../../components/fab/studentProfile";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Tooltip from "@mui/material/Tooltip";
import BrowserNotification from "../../components/fab/BrowserNotification";
import * as htmlToImage from "html-to-image";

function Fab({ data }) {
  if (!data) return null;

  const handleScreenshot = () => {
    const node = document.getElementById("main-clearance-container"); // target the main container

    if (!node) return;

    htmlToImage
      .toPng(node, { backgroundColor: "#ffffff" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Screenshot failed:", error);
      });
  };

  return (
    <div className="fixed z-[9999] bottom-6 left-6 flex flex-col items-end space-y-4">
      <StudentProfile info={data} />
      <BrowserNotification info={data} />
      <Tooltip title="Take Screenshot" placement="left" arrow>
        <div
          className="bg-white p-3 mb-24 rounded-full shadow-2xl cursor-pointer group hover:bg-green-500 duration-300 hover:scale-110"
          onClick={handleScreenshot}
        >
          <CameraAltIcon
            fontSize="medium"
            className="text-green-500 group-hover:text-white"
          />
        </div>
      </Tooltip>
      <Tooltip title="Logout" placement="left" arrow>
        <Link
          to="/logout"
          className="bg-white p-3 rounded-full shadow-2xl cursor-pointer group hover:bg-red-500 duration-300 hover:scale-110"
        >
          <ExitToAppIcon
            fontSize="medium"
            className="text-red-500 group-hover:text-white"
          />
        </Link>
      </Tooltip>
    </div>
  );
}

export default Fab;
