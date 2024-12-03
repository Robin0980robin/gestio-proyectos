import { Layout, Menu, Typography } from "antd"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import logo from "../assets/logo.png"
const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate()
  const isAuth = useAuthStore(state => state.isAuth)
  const currentUser = useAuthStore(state => state.currentUser)
  const logout = useAuthStore(state => state.logout)

  let menuItems = []
  if (isAuth) {
    menuItems.push({ key: 1, label: currentUser.name })
    menuItems.push({
      key: 2, label: "Cerrar sesión", onClick: () => {
        navigate("/")
        logout()
      }
    })
  } else {
    menuItems.push({ key: 1, label: "Iniciar sesión", onClick: () => navigate("/login") })
    menuItems.push({ key: 2, label: "Registrarse", onClick: () => navigate("/register") })
  }

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginTop: 12, marginRight: "75%" }}>
        <img src={logo} height={40} />
        <span style={{ color: 'white', fontWeight: 'bolder' }}>Capacita T</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  )
}

export default Navbar