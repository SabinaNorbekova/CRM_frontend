import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import TeacherDashboard from "../pages/dashboard/TeacherDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";


import AdminLayout from "../pages/dashboard/AdminLayout";
import AdminDashboardHome from "../pages/dashboard/AdminDashboardHome";
import StudentsPage from "../pages/students/StudentsPage";
import TeachersPage from "../pages/teachers/TeachersPage";
import GroupsPage from "../pages/groups/GroupsPage";
import CoursesPage from "../pages/courses/CoursesPage";
import RoomsPage from "../pages/Rooms/RoomsPage";
import UsersPage from "../pages/users/UsersPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
