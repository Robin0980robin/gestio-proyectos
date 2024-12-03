import { Button, Card, Form, Input, Layout, message } from "antd";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { usersStorage } from "../storage/usersStorage";
import useAuthStore from "../stores/authStore";

const ProfilePage = () => {
    const currentUser = useAuthStore(state => state.currentUser)

    const handleFinish = (values) => {
        console.log('values', values)
        const updateUserResult = usersStorage.updateUser(currentUser.id, values)
        if(updateUserResult.status){
            message.success("Usuario actualizado con éxito")
        }else{
            message.error(updateUserResult.message)
        }
    }


    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh' }}>
                <Card title="Mi Perfil" style={{ marginTop: 12 }}>
                    <Form
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{
                            name: currentUser.name,
                            email: currentUser.email,
                            password: currentUser.password
                        }}>
                        <Form.Item label="Nombre" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Correo electŕonico" name="email">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Contraseña" name="password">
                            <Input />
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            Actualizar perfil
                        </Button>
                    </Form>
                </Card>
            </Layout.Content>

        </Layout>
    )

}

export default ProfilePage