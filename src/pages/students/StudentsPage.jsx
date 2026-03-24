import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
} from "../../services/students.service";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  birth_date: "",
  photo: null,
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setErrorText("");
      const res = await getAllStudents();
      setStudents(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Talabalarni yuklab bo‘lmadi"
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return students;

    return students.filter((student) => {
      const fullName = student?.fullName?.toLowerCase() || "";
      const email = student?.email?.toLowerCase() || "";

      return fullName.includes(keyword) || email.includes(keyword);
    });
  }, [students, search]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData((prev) => ({
        ...prev,
        photo: files?.[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.birth_date
    ) {
      setErrorText("Majburiy maydonlarni to‘ldiring");
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorText("");

      await createStudent({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        birth_date: formData.birth_date,
        photo: formData.photo,
      });

      closeCreateModal();
      await fetchStudents();
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Talaba yaratishda xatolik"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    const isConfirmed = window.confirm(
      "Haqiqatan ham bu talabani o‘chirmoqchimisiz?"
    );

    if (!isConfirmed) return;

    try {
      setErrorText("");
      await deleteStudent(id);
      await fetchStudents();
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Talabani o‘chirishda xatolik"
      );
    }
  };

  return (
    <div>
      <Box className="mb-6">
        <Typography variant="h4" className="!font-bold !text-[#111827]">
          Talabalar
        </Typography>
      </Box>

      <Paper
        elevation={0}
        className="!rounded-2xl !p-5 border border-gray-200 !shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
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
              Talaba qo‘shish
            </Button>
          </div>

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
        ) : filteredStudents.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300">
            <Typography className="!text-gray-500">
              Hozircha talabalar yo‘q
            </Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Talaba</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Tug‘ilgan sana</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Yaratilgan sana</th>
                  <th className="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="bg-white">
                    <td className="px-4 py-4 rounded-l-xl">{index + 1}</td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            student?.photo
                              ? `http://localhost:3000/uploads/${student.photo}`
                              : ""
                          }
                        >
                          {student?.fullName?.[0] || "S"}
                        </Avatar>

                        <div>
                          <p className="font-medium text-[#111827]">
                            {student?.fullName || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">{student?.email || "-"}</td>
                    <td className="px-4 py-4">
                      {student?.birth_date
                        ? new Date(student.birth_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-4">{student?.status || "-"}</td>
                    <td className="px-4 py-4">
                      {student?.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-4 rounded-r-xl">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton size="small">
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>

                        <IconButton size="small">
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </div>
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
        <DialogTitle>Talaba qo‘shish</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleCreateStudent}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <TextField
              label="F.I.SH"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Parol"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              type="date"
              label="Tug‘ilgan sana"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="file"
              name="photo"
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {formData.photo && (
              <Typography className="!text-sm !text-gray-600">
                Tanlangan fayl: {formData.photo.name}
              </Typography>
            )}

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
