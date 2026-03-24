import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAllCourses, createCourse } from "../../services/courses.service";

const courseLevels = [
  { label: "BEGINNER", value: "BEGINNER" },
  { label: "ELEMENTARY", value: "ELEMENTARY" },
  { label: "INTERMEDIATE", value: "INTERMEDIATE" },
  { label: "ADVANCED", value: "ADVANCED" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    durationMonth: "",
    durationLesson: "",
    level: "",
    price: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setErrorText("");
      const res = await getAllCourses();
      setCourses(res?.data || []);
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Kurslarni yuklab bo‘lmadi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      durationMonth: "",
      durationLesson: "",
      level: "",
      price: "",
      description: "",
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.durationMonth ||
      !formData.durationLesson ||
      !formData.price
    ) {
      setErrorText("Majburiy maydonlarni to‘ldiring");
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorText("");

      const payload = {
        name: formData.name.trim(),
        durationMonth: Number(formData.durationMonth),
        durationLesson: Number(formData.durationLesson),
        level: formData.level || undefined,
        price: String(formData.price),
        description: formData.description.trim(),
      };

      await createCourse(payload);
      setOpenCreate(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      setErrorText(error?.response?.data?.message || "Kurs yaratishda xatolik");
    } finally {
      setSubmitLoading(false);
    }
  };

  const tabs = useMemo(
    () => [
      { label: "Kurslar", active: true },
      { label: "Xonalar", active: false },
      { label: "Hodimlar", active: false },
    ],
    []
  );

  return (
    <div>
      <Box className="mb-6">
        <Typography variant="h4" className="!font-bold !text-[#111827]">
          Boshqarish
        </Typography>
      </Box>

      <Box className="flex items-center gap-6 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`pb-3 text-[15px] font-medium border-b-2 transition ${
              tab.active
                ? "text-[#7c4dff] border-[#7c4dff]"
                : "text-gray-500 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </Box>

      <Paper
        elevation={0}
        className="!rounded-2xl !p-5 border border-gray-200 !shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <Typography className="!text-[28px] !font-semibold !text-[#111827]">
            Kurslar
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
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
            Kurs qo‘shish
          </Button>
        </div>

        {loading ? (
          <div className="h-[220px] flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : errorText ? (
          <Typography className="!text-red-600 !font-medium">
            {errorText}
          </Typography>
        ) : courses.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300">
            <Typography className="!text-gray-500">
              Hozircha kurslar yo‘q
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Paper
                key={course.id}
                elevation={0}
                className="!rounded-2xl !p-5 border border-gray-200 bg-[#fcfcfd]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Typography className="!text-[20px] !font-semibold !text-[#111827]">
                      {course.name}
                    </Typography>

                    <Typography className="!text-gray-500 !mt-2 !text-[14px] min-h-[40px]">
                      {course.description || "Izoh yo‘q"}
                    </Typography>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-[13px] text-gray-700">
                        {course.durationLesson} min
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-[13px] text-gray-700">
                        {course.durationMonth} oy
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-[13px] text-gray-700">
                        {course.price} so‘m
                      </span>
                      {course.level && (
                        <span className="px-3 py-1 rounded-full bg-[#efe8ff] text-[13px] text-[#7c4dff]">
                          {course.level}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <IconButton size="small">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        )}
      </Paper>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Kurs qo‘shish</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleCreateCourse}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <TextField
              label="Kurs nomi"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Davomiyligi (oy)"
                name="durationMonth"
                type="number"
                value={formData.durationMonth}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Dars davomiyligi (min)"
                name="durationLesson"
                type="number"
                value={formData.durationLesson}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                select
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Tanlanmagan</MenuItem>
                {courseLevels.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Narxi"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <TextField
              label="Izoh"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              minRows={3}
              fullWidth
            />

            {errorText && (
              <Typography className="!text-red-600 !text-sm">
                {errorText}
              </Typography>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => setOpenCreate(false)}
                sx={{ textTransform: "none" }}
              >
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
