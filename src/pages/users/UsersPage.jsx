import { useMemo, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createUser } from "../../services/users.service";

const roleOptions = [
  { label: "SUPERADMIN", value: "SUPERADMIN" },
  { label: "ADMIN", value: "ADMIN" },
  { label: "MANAGEMENT", value: "MANAGEMENT" },
  { label: "ADMINSTRATOR", value: "ADMINSTRATOR" },
];

export default function UsersPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    position: "",
    hire_date: "",
    role: "",
    address: "",
    photo: null,
  });

  const tabs = useMemo(
    () => [
      { label: "Kurslar", active: false },
      { label: "Xonalar", active: false },
      { label: "Hodimlar", active: true },
    ],
    []
  );

  // backendda list yo'q bo'lgani uchun hozircha bo'sh
  const users = [];

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
    setFormData({
      fullName: "",
      email: "",
      password: "",
      position: "",
      hire_date: "",
      role: "",
      address: "",
      photo: null,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.position.trim() ||
      !formData.hire_date ||
      !formData.role
    ) {
      setErrorText("Majburiy maydonlarni to‘ldiring");
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorText("");

      await createUser(formData);

      setOpenCreate(false);
      resetForm();
    } catch (error) {
      setErrorText(
        error?.response?.data?.message || "Xodim yaratishda xatolik"
      );
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
            Xodimlar
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
            Xodim qo‘shish
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-4 py-3">F.I.SH</th>
                <th className="px-4 py-3">Lavozimi</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Ishga kirgan sana</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Manzil</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="bg-white">
                    <td className="px-4 py-4 rounded-l-xl font-medium">
                      {user.fullName}
                    </td>
                    <td className="px-4 py-4">{user.position}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">{user.hire_date}</td>
                    <td className="px-4 py-4">{user.role}</td>
                    <td className="px-4 py-4">{user.address || "-"}</td>
                    <td className="px-4 py-4 rounded-r-xl text-right">-</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="h-[180px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300">
                      <Typography className="!text-gray-500 text-center">
                        Hozircha ro‘yxat endpointi yo‘q.
                        <br />
                        Backendga <b>GET /users/all</b> qo‘shilgach bu yer real
                        ma’lumot bilan to‘ladi.
                      </Typography>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Xodim qo‘shish</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleCreateUser}
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
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Lavozimi"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                type="date"
                label="Ishga kirgan sana"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <TextField
              select
              label="Rol"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
            >
              {roleOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Manzil"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              type="file"
              name="photo"
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
