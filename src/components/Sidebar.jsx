import logo from "../assets/images/logo.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PeopleIcon from "@mui/icons-material/People";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserIdFromToken } from "../utils/auth";
import api from "../assets/api";
import BrowserNotification from "./fab/BrowserNotification";
function Sidebar() {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const access = localStorage.getItem("access");
    const id = getUserIdFromToken(access);

    if (!access || !id) {
      console.error("Access token or user ID is missing.");
      return;
    }

    setUserId(id);

    api
      .get(`/api/user/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
      .then((response) => {
        console.log("User Info:", response.data);
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
  }, []);

  return (
    <>
      <BrowserNotification userId={userInfo?.id} />

      <aside className="fixed w-64 bg-gray-800 md:block min-h-screen">
        <div className="py-3 text-2xl uppercase text-center tracking-widest bg-green-900 border-b-2 border-green-800 mb-8">
          <div className="bg-white rounded-full w-16 mx-auto">
            <img src={logo} alt="" />
          </div>
        </div>
        <nav className="text-sm text-gray-300">
          <ul className="flex flex-col">
            <li className="cursor-pointer">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `py-3 px-4 flex items-center ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
                Dashboard
              </NavLink>
            </li>
            {/* {userInfo?.is_superuser && (
							<li className="px-4 cursor-pointer hover:bg-green-700">
								<a
									className="py-3 flex items-center"
									href="/">
									<BadgeIcon
										fontSize="small"
										className="mr-1"
									/>
									Staffs
								</a>
							</li>
						)} */}

            <li className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
              STUDENT MANAGEMENT
            </li>
            <li className="cursor-pointer hover:bg-green-700">
              <NavLink
                className={({ isActive }) =>
                  `py-3 px-4 flex items-center ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`
                }
                to="/request-signature"
              >
                <PeopleIcon fontSize="small" className="mr-1" />
                Signature Requests
              </NavLink>
            </li>
            {userInfo?.is_superuser && (
              <li className="cursor-pointer hover:bg-green-700">
                <NavLink
                  className={({ isActive }) =>
                    `py-3 px-4 flex items-center ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "hover:bg-gray-700 text-gray-300"
                    }`
                  }
                  to="/request-clearance"
                >
                  <PeopleIcon fontSize="small" className="mr-1" />
                  Clearance Requests
                </NavLink>
              </li>
            )}
            <li className="cursor-pointer hover:bg-green-700">
              <NavLink
                to="/signature"
                className={({ isActive }) =>
                  `py-3 px-4 flex items-center ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <EditNoteIcon fontSize="small" className="mr-1" />
                Signatures
              </NavLink>
            </li>
            {userInfo?.is_superuser && (
              <li className="cursor-pointer hover:bg-green-700">
                <NavLink
                  to="/release-clearance"
                  className={({ isActive }) =>
                    `py-3 px-4 flex items-center ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "hover:bg-gray-700 text-gray-300"
                    }`
                  }
                >
                  <EditNoteIcon fontSize="small" className="mr-1" />
                  Clearance Release
                </NavLink>
              </li>
            )}

            <li className="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
              Profile
            </li>
            <li className="px-4 cursor-pointer hover:bg-green-700">
              <NavLink to="/logout" className="py-2 flex items-center">
                <ExitToAppIcon fontSize="small" className="mr-1" />
                Logout
              </NavLink>
            </li>
            {/* <li className="px-4 cursor-pointer hover:bg-green-700">
							<NavLink
								to="/profile"
								className="py-2 flex items-center">
								<AdminPanelSettingsIcon
									fontSize="small"
									className="mr-1"
								/>
								Profile
							</NavLink>
						</li> */}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
