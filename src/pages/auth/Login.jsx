import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../../services/auth.service";
import { getUserFromToken, isAdminRole, saveToken } from "../../utils/auth";
import loginImg from "../../assets/login.png";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

//   useEffect(() => {
//     const user = getUserFromToken();

//     if (!user?.role) return;

//     if (isAdminRole(user.role)) {
//       navigate("/admin", { replace: true });
//     } else if (user.role === "TEACHER") {
//       navigate("/teacher", { replace: true });
//     } else if (user.role === "STUDENT") {
//       navigate("/student", { replace: true });
//     }
//   }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorText) setErrorText("");
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.login.trim() || !formData.password.trim()) {
    setErrorText("Login va parolni kiriting");
    return;
  }

  try {
    setLoading(true);
    setErrorText("");

    const res = await loginUser(formData);

    if (res?.accessToken) {
      saveToken(res.accessToken);

      const user = getUserFromToken();

      if (isAdminRole(user?.role)) {
        navigate("/admin", { replace: true });
      } else if (user?.role === "TEACHER") {
        navigate("/teacher", { replace: true });
      } else if (user?.role === "STUDENT") {
        navigate("/student", { replace: true });
      } else {
        setErrorText("Foydalanuvchi roli topilmadi");
      }
    }
  } catch (error) {
    setErrorText(
      error?.response?.data?.message || "Login yoki parol noto‘g‘ri"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <Box className="min-h-screen w-full flex">
      <Box className="hidden md:flex w-1/2 bg-[#1f2f6b] items-center justify-center p-8">
        <img
          src={loginImg}
          alt="login"
          className="w-full max-w-[700px] object-contain"
        />
      </Box>

      <Box className="w-full md:w-1/2 bg-[#f5f5f5] flex items-center justify-center p-6">
        <Paper
          elevation={0}
          className="w-full max-w-[460px] !bg-transparent !shadow-none"
        >
          <Box className="text-center mb-10">
            <Typography
              variant="h4"
              className="!font-semibold !uppercase !text-black"
            >
              CRM BASIC PROJECT
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} className="space-y-6">
            <Box>
              <Typography className="!mb-2 !text-black">Login</Typography>
              <TextField
                fullWidth
                name="login"
                placeholder="Loginni kiriting"
                value={formData.login}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    height: "54px",
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-2 !text-black">Parol</Typography>
              <TextField
                fullWidth
                name="password"
                placeholder="Parolni kiriting"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    height: "54px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {errorText && (
              <Typography className="!text-red-600 !text-sm">
                {errorText}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: "50px",
                backgroundColor: "#1f2f6b",
                textTransform: "none",
                fontSize: "20px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#182556",
                },
              }}
            >
              {loading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </Box>

          <Box className="mt-32 text-center">
            <Typography className="!text-gray-700">
              Copyright © 2026 CRM Basic Project
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
