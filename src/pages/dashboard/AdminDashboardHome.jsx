import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { getDashboardStats } from "../../services/dashboard.service";

export default function AdminDashboardHome() {
  const { displayName } = useOutletContext();

  const [stats, setStats] = useState({
    students: 0,
    groups: 0,
    teachers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setErrorText("");

        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        setErrorText(
          error?.response?.data?.message ||
            "Dashboard ma'lumotlarini yuklab bo'lmadi"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Faol talabalar",
      value: stats.students,
      icon: <SchoolIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Guruhlar",
      value: stats.groups,
      icon: <MenuBookIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "O‘qituvchilar",
      value: stats.teachers,
      icon: <GroupsIcon sx={{ fontSize: 34 }} />,
    },
  ];

  return (
    <div>
      <Box className="mb-8">
        <Typography variant="h4" className="!font-bold !text-[#111827] !mb-2">
          Xush kelibsiz, {displayName}!
        </Typography>

        <Typography className="!text-gray-500 !text-[18px]">
          CRM Project platformasiga xush kelibsiz
        </Typography>
      </Box>

      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <CircularProgress />
        </div>
      ) : errorText ? (
        <Paper className="!p-6 !rounded-2xl">
          <Typography className="!text-red-600 !font-medium">
            {errorText}
          </Typography>
        </Paper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Paper
              key={card.title}
              elevation={0}
              className="!rounded-2xl !p-6 !shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Typography className="!text-gray-500 !text-[16px]">
                    {card.title}
                  </Typography>
                  <Typography className="!text-[38px] !font-bold !text-[#111827] !mt-3">
                    {card.value}
                  </Typography>
                </div>

                <div className="w-[56px] h-[56px] rounded-xl bg-[#eef2ff] text-[#1f2f6b] flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
}
