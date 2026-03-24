import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import { getAllGroups, createGroup } from "../../services/groups.service";
import { getAllTeachers } from "../../services/teachers.service";
import { getAllCourses } from "../../services/courses.service";
import { getAllRooms } from "../../services/rooms.service";

const weekDaysOptions = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const initialFormData = {
  name: "",
  teacherId: "",
  roomId: "",
  courseId: "",
  startDate: "",
  startTime: "",
  weekDays: [],
};

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const [groupsRes, teachersRes, coursesRes, roomsRes] = await Promise.all([
        getAllGroups(),
        getAllTeachers(),
        getAllCourses(),
        getAllRooms(),
      ]);

      setGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : []);
      setTeachers(Array.isArray(teachersRes?.data) ? teachersRes.data : []);
      setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      setRooms(Array.isArray(roomsRes?.data) ? roomsRes.data : []);
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Guruhlarni yuklab bo‘lmadi"
      );
      setGroups([]);
      setTeachers([]);
      setCourses([]);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const teachersMap = useMemo(() => {
    return Object.fromEntries(teachers.map((item) => [item.id, item.fullName]));
  }, [teachers]);

  const coursesMap = useMemo(() => {
    return Object.fromEntries(courses.map((item) => [item.id, item.name]));
  }, [courses]);

  const roomsMap = useMemo(() => {
    return Object.fromEntries(rooms.map((item) => [item.id, item.name]));
  }, [rooms]);

  const filteredGroups = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return groups;

    return groups.filter((group) => {
      const name = group?.name?.toLowerCase() || "";
      const teacherName = (teachersMap[group.teacherId] || "").toLowerCase();
      const courseName = (coursesMap[group.courseId] || "").toLowerCase();
      const roomName = (roomsMap[group.roomId] || "").toLowerCase();

      return (
        name.includes(keyword) ||
        teacherName.includes(keyword) ||
        courseName.includes(keyword) ||
        roomName.includes(keyword)
      );
    });
  }, [groups, search, teachersMap, coursesMap, roomsMap]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWeekDaysChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      weekDays: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const closeCreateModal = () => {
    setOpenCreate(false);
    resetForm();
    setErrorText("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.teacherId ||
      !formData.roomId ||
      !formData.courseId ||
      !formData.startDate ||
      !formData.startTime ||
      formData.weekDays.length === 0
    ) {
      setErrorText("Majburiy maydonlarni to‘ldiring");
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorText("");

      await createGroup({
        name: formData.name.trim(),
        teacherId: Number(formData.teacherId),
        roomId: Number(formData.roomId),
        courseId: Number(formData.courseId),
        startDate: formData.startDate,
        startTime: formData.startTime,
        weekDays: formData.weekDays,
      });

      closeCreateModal();
      await fetchAllData();
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Group yaratishda xatolik"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <Box className="mb-6 flex items-center justify-between gap-4">
        <Typography variant="h4" className="!font-bold !text-[#111827]">
          Guruhlar
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setErrorText("");
            setOpenCreate(true);
          }}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            backgroundColor: "#7c4dff",
            px: 2.2,
            py: 1.1,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#6d3df1",
            },
          }}
        >
          Guruh qo‘shish
        </Button>
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Paper
          elevation={0}
          className="!rounded-2xl !p-5 border border-gray-200 !shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography className="!text-gray-500">Jami guruhlar</Typography>
              <Typography className="!text-[34px] !font-bold !mt-2">
                {groups.length}
              </Typography>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-[#eef2ff] text-[#1f2f6b] flex items-center justify-center">
              <GroupWorkOutlinedIcon />
            </div>
          </div>
        </Paper>

        <Paper
          elevation={0}
          className="!rounded-2xl !p-5 border border-gray-200 !shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography className="!text-gray-500">O‘qituvchilar</Typography>
              <Typography className="!text-[34px] !font-bold !mt-2">
                {teachers.length}
              </Typography>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-[#eef2ff] text-[#1f2f6b] flex items-center justify-center">
              <SchoolOutlinedIcon />
            </div>
          </div>
        </Paper>

        <Paper
          elevation={0}
          className="!rounded-2xl !p-5 border border-gray-200 !shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography className="!text-gray-500">Xonalar</Typography>
              <Typography className="!text-[34px] !font-bold !mt-2">
                {rooms.length}
              </Typography>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-[#eef2ff] text-[#1f2f6b] flex items-center justify-center">
              <MeetingRoomOutlinedIcon />
            </div>
          </div>
        </Paper>
      </div>

      <Paper
        elevation={0}
        className="!rounded-2xl !p-5 border border-gray-200 !shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <Typography className="!text-[24px] !font-semibold !text-[#111827]">
            Guruhlar ro‘yxati
          </Typography>

          <div className="w-full md:w-[320px]">
            <TextField
              fullWidth
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        {errorText && !openCreate && (
          <Typography className="!text-red-600 !font-medium !mb-4">
            {errorText}
          </Typography>
        )}

        {loading ? (
          <div className="h-[260px] flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300">
            <Typography className="!text-gray-500">
              Hozircha guruhlar yo‘q
            </Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Guruh</th>
                  <th className="px-4 py-3">Kurs</th>
                  <th className="px-4 py-3">Boshlanish</th>
                  <th className="px-4 py-3">Dars vaqti</th>
                  <th className="px-4 py-3">Hafta kunlari</th>
                  <th className="px-4 py-3">Xona</th>
                  <th className="px-4 py-3">O'qituvchi</th>
                </tr>
              </thead>

              <tbody>
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="bg-white">
                    <td className="px-4 py-4 rounded-l-xl">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {group.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-medium">{group.name}</td>
                    <td className="px-4 py-4">
                      {coursesMap[group.courseId] || "-"}
                    </td>
                    <td className="px-4 py-4">
                      {group.startDate
                        ? new Date(group.startDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-4">{group.startTime || "-"}</td>
                    <td className="px-4 py-4">
                      {Array.isArray(group.weekDays) &&
                      group.weekDays.length > 0
                        ? group.weekDays.join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      {roomsMap[group.roomId] || "-"}
                    </td>
                    <td className="px-4 py-4 rounded-r-xl">
                      {teachersMap[group.teacherId] || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Paper>

      <Dialog
        open={openCreate}
        onClose={closeCreateModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Guruh qo‘shish</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleCreateGroup}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <TextField
              label="Guruh nomi"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                select
                label="O‘qituvchi"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                fullWidth
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Kurs"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                fullWidth
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                select
                label="Xona"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                fullWidth
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="date"
                label="Boshlanish sanasi"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                type="time"
                label="Dars boshlanish vaqti"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                select
                SelectProps={{ multiple: true }}
                label="Hafta kunlari"
                name="weekDays"
                value={formData.weekDays}
                onChange={handleWeekDaysChange}
                fullWidth
              >
                {weekDaysOptions.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {errorText && (
              <Typography className="!text-red-600 !text-sm">
                {errorText}
              </Typography>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={closeCreateModal} sx={{ textTransform: "none" }}>
                Bekor qilish
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitLoading}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#7c4dff",
                  "&:hover": {
                    backgroundColor: "#6d3df1",
                  },
                }}
              >
                {submitLoading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
