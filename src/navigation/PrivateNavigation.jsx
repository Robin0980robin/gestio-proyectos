import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import ProfilePage from "../pages/ProfilePage"
import useAuthStore from "../stores/authStore"
import ResumePage from "../pages/ResumePage"
import MyProjectsPage from "../pages/MyProjectsPage"
import ProjectsPage from "../pages/ProjectsPage"

const PrivateNavigation = () => {
    const currentUser = useAuthStore(state => state.currentUser)
    return(
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ResumePage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/my-profile" element={<ProfilePage />} />
          {currentUser.isTeacher && (
            <Route path="/projects" element={<ProjectsPage />} />
          )}
        </Routes>
      </BrowserRouter>
    )
}

export default PrivateNavigation