import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAllRooms, createRoom } from "../../services/rooms.service";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  });

  const tabs = useMemo(
    () => [
      { label: "Kurslar", active: false },
      { label: "Xonalar", active: true },
      { label: "Hodimlar", active: false },
    ],
    []
  );

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setErrorText("");
      const res = await getAllRooms();
      setRooms(res?.data || []);
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Xonalarni yuklab bo‘lmadi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
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
      capacity: "",
    });
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.capacity) {
      setErrorText("Xona nomi va sig‘imini kiriting");
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorText("");

      await createRoom({
        name: formData.name.trim(),
        capacity: Number(formData.capacity),
      });

      setOpenCreate(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      setErrorText(error?.response?.data?.message || "Xona yaratishda xatolik");
    } finally {
      setSubmitLoading(false);
    }
  };

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
            Xonalar
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
            Xonani qo‘shish
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
        ) : rooms.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300">
            <Typography className="!text-gray-500">
              Hozircha xonalar yo‘q
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <Paper
                key={room.id}
                elevation={0}
                className="!rounded-2xl !p-5 border border-gray-200 bg-[#fcfcfd]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Typography className="!text-[20px] !font-semibold !text-[#111827]">
                      {room.name}
                    </Typography>

                    <Typography className="!text-gray-500 !mt-2 !text-[15px]">
                      Sig‘imi: {room.capacity}
                    </Typography>
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
        <DialogTitle>Xonani qo‘shish</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleCreateRoom}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <TextField
              label="Xona nomi"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Sig‘imi"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
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
