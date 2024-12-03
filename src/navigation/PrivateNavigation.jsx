import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import CoursesPage from "../pages/CoursesPage"
import CourseDetailPage from "../pages/CourseDetailPage"
import SupportPage from "../pages/SupportPage"
import ProfilePage from "../pages/ProfilePage"
import useAuthStore from "../stores/authStore"
import AdminPage from "../pages/AdminPage"
import { useEffect } from "react"
import ResumePage from "../pages/ResumePage"
import MyProjectsPage from "../pages/MyProjectsPage"

const PrivateNavigation = () => {
    const currentUser = useAuthStore(state => state.currentUser)
    return(
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ResumePage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/course/:courseId" element={<CourseDetailPage />} />
          <Route path="/my-profile" element={<ProfilePage />} />
          {currentUser.isAdmin && (
            <Route path="/admin" element={<AdminPage />} />
          )}
        </Routes>
      </BrowserRouter>
    )
}

export default PrivateNavigation