import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { getUserFromToken } from "../../utils/auth";

export default function AdminLayout() {
  const [openManagement, setOpenManagement] = useState(false);
  const user = getUserFromToken();

  const displayName = useMemo(() => {
    if (!user) return "Admin";
    return user.fullName || user.email || "Admin";
  }, [user]);

  const mainMenuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium transition ${
      isActive
        ? "bg-[#7c4dff] text-white"
        : "text-[#374151] hover:bg-[#f3f4f6]"
    }`;

  const managementMenuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium transition ${
      isActive
        ? "bg-[#f3f4f6] text-[#111827]"
        : "text-[#374151] hover:bg-[#f9fafb]"
    }`;

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[230px] bg-white border-r border-gray-200 min-h-screen px-4 py-6">
        <h1 className="text-[20px] font-bold text-[#1f2f6b] mb-8 uppercase">
          CRM PROJECT
        </h1>

        <nav className="flex flex-col gap-2">
          <NavLink to="/admin" end className={mainMenuClass}>
            <HomeOutlinedIcon />
            <span>Asosiy</span>
          </NavLink>

          <NavLink to="/admin/teachers" className={mainMenuClass}>
            <GroupsOutlinedIcon />
            <span>O‘qituvchilar</span>
          </NavLink>

          <NavLink to="/admin/groups" className={mainMenuClass}>
            <MenuBookOutlinedIcon />
            <span>Guruhlar</span>
          </NavLink>

          <NavLink to="/admin/students" className={mainMenuClass}>
            <SchoolOutlinedIcon />
            <span>Talabalar</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setOpenManagement(true)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium text-left transition ${
              openManagement
                ? "bg-[#7c4dff] text-white"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <SettingsOutlinedIcon />
            <span>Boshqarish</span>
          </button>
        </nav>
      </aside>

      {/* MANAGEMENT DRAWER */}
      {openManagement && (
        <div className="w-[250px] bg-white border-r border-gray-200 min-h-screen px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-[#111827]">Menu</h2>

            <button
              type="button"
              onClick={() => setOpenManagement(false)}
              className="w-8 h-8 rounded-md bg-[#7c4dff] text-white flex items-center justify-center hover:opacity-90"
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <NavLink to="/admin/courses" className={managementMenuClass}>
              <MenuBookOutlinedIcon />
              <span>Kurslar</span>
            </NavLink>

            <NavLink to="/admin/rooms" className={managementMenuClass}>
              <MeetingRoomOutlinedIcon />
              <span>Xonalar</span>
            </NavLink>

            <NavLink to="/admin/users" className={managementMenuClass}>
              <PersonOutlineOutlinedIcon />
              <span>Hodimlar</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="flex-1 px-8 py-8">
        <Outlet context={{ displayName }} />
      </main>
    </div>
  );
}