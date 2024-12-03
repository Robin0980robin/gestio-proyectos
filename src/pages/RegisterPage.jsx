import { Button, Card, Form, Input, Layout, message, Row } from "antd"
import Navbar from "../components/Navbar"
import { usersStorage } from "../storage/usersStorage"
import useAuthStore from "../stores/authStore"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const RegisterPage = () => {
    const login = useAuthStore(state => state.login)
    const navigate = useNavigate()

    const handleSubmit = (values) => {
        const fullValues = {
            ...values,
            isStudent: true
        }
        const createUserResult = usersStorage.saveUser(fullValues)
        if (createUserResult.status) {
            message.success("Usuario creado exitosamente!")
            login(createUserResult.user)
            navigate("/")
        } else {
            message.error("Algo salió mal creando el usuario")
        }
    }

    const validatePassword = (_, value) => {
        const minLength = value?.length >= 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!value) {
            return Promise.reject('Por favor ingresa una contraseña');
        }

        const errors = [];
        if (!minLength) errors.push('mínimo 8 caracteres');
        if (!hasUpperCase) errors.push('una mayúscula');
        if (!hasLowerCase) errors.push('una minúscula');
        if (!hasNumber) errors.push('un número');
        if (!hasSymbol) errors.push('un símbolo');

        if (errors.length > 0) {
            return Promise.reject('La contraseña debe contener: ' + errors.join(', '));
        }

        return Promise.resolve();
    };


    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, backgroundColor: 'white' }}>
                <Card title="Registrarse" style={{ width: '30%' }}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Nombre"
                            name="name"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu nombre' },
                                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Correo electrónico"
                            name="email"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu email' },
                                { type: 'email', message: 'Por favor ingresa un email válido' },
                                {
                                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Por favor ingresa un email válido (usuario@gmail.com)'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Contraseña"
                            name="password"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu contraseña' },
                                { validator: validatePassword }
                            ]}
                            help="La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo"
                        >
                            <Input.Password />
                        </Form.Item>


                        <Row justify="center">
                            <Button htmlType="submit" type="primary">Registrarse</Button>
                        </Row>
                    </Form>
                </Card>
            </Layout.Content>
        </Layout>
    )
}

export default RegisterPage;