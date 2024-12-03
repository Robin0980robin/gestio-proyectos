import { Button, Card, Form, Input, Layout, message, Row } from "antd"
import Navbar from "../components/Navbar"
import { usersStorage } from "../storage/usersStorage"
import useAuthStore from "../stores/authStore"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const LoginPage = () => {
    const login = useAuthStore(state => state.login)
    const navigate = useNavigate()

    const handleSubmit = (values) => {
        const makeLogin = usersStorage.loginUser(values.email, values.password)
        if (makeLogin.status) {
            login(makeLogin.user)
            navigate("/")
        } else {
            message.error("Credenciales inválidas")
        }
    }

    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, backgroundColor: 'white' }}>
                <Card title="Iniciar Sesión" style={{ width: '30%' }}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Correo electrónico" name="email"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu email' },
                                { type: 'email', message: 'Por favor ingresa un email válido' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Contraseña" name="password"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu password' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Row justify="center">
                            <Button htmlType="submit" type="primary">Iniciar Sesión</Button>
                        </Row>
                    </Form>
                </Card>
            </Layout.Content>
        </Layout>
    )
}

export default LoginPage;