import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import '../styles/home.css'
import useAuthStore from "../stores/authStore"

const Header = () => {
    const navigate = useNavigate()
    const isAuth = useAuthStore(state => state.isAuth)
    const currentUser = useAuthStore(state => state.currentUser)
    const logout = useAuthStore(state => state.logout)

    const handleLogout = () => {
        navigate("/")
        logout()
    }

    return (
        <header>
            <div class="logo">
                <h1>Control de Proyectos de Investigación</h1>
            </div>
            <nav>
                {isAuth ? (
                    <ul>
                        <li onClick={() => navigate("/")}><a>Dashboard</a></li>
                        <li onClick={handleLogout}><a>Cerrar Sesión</a></li>
                    </ul>
                ) : (
                    <ul>
                        <li onClick={() => navigate("/")}><a>Inicio</a></li>
                        <li onClick={() => navigate("/login")}><a>Iniciar Sesión</a></li>
                        <li onClick={() => navigate("/register")}><a>Registarse</a></li>
                    </ul>
                )}
            </nav>
        </header>
    )
}

export default Header