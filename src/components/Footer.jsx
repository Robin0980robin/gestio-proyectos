import { GithubOutlined, QuestionOutlined } from "@ant-design/icons"
import { Space, Typography } from "antd"
import { useNavigate } from "react-router-dom"
import '../styles/home.css'
const { Paragraph } = Typography

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer>
      <p>&copy;2024 ******** Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer
