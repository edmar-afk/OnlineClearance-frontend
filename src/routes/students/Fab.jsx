import { Link } from "react-router-dom";
import StudentProfile from "../../components/fab/studentProfile";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import BrowserNotification from "../../components/fab/BrowserNotification";

function Fab({ data }) {
  if (!data) return null;

  return (
    <div className="fixed z-[9999] bottom-6 left-6 flex flex-col items-end space-y-4">
      <StudentProfile info={data} />
      <BrowserNotification info={data} />
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
