import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Upload, Button, Card, Typography, message, Layout, Spin } from 'antd';
import { XMLParser } from 'fast-xml-parser';
import Navbar from '../components/Navbar';
import { problemsStorage } from '../storage/problemsStorage';
import Header from '../components/Header';

const { Title, Paragraph } = Typography;


const SupportPage = () => {
    const [categories, setCategories] = useState([])
    const [form] = Form.useForm();

    useEffect(() => {
        const loadSupportData = async () => {
            try {
                const response = await fetch('/data/support.xml');
                const xmlText = await response.text();

                const parser = new XMLParser();
                const data = parser.parse(xmlText);

                const supportSystem = data['support-system']

                const categoriesToSelect = supportSystem['problem-categories']['category'].map((cat) => {
                    return {
                        label: cat.name,
                        value: cat.id
                    }
                })

                setCategories(categoriesToSelect)
            } catch (error) {
                console.error('Error loading support data:', error);
                message.error('Error cargando el formulario de soporte');
            }
        };

        loadSupportData();
    }, []);


    const onFinish = (values) => {
        const saveProblemResult = problemsStorage.saveProblem(values)
        if(saveProblemResult.status){
            message.success('Solicitud de soporte enviada correctamente');
            form.resetFields();
        }
    };


    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh', margin: '0 auto' }}>
                {
                    !categories ? <Spin />
                        : (
                            <Card style={{ marginTop: 20 }} >
                                <Title level={2}>Soporte Técnico</Title>
                                <Paragraph className="mb-6">
                                    Por favor, completa el siguiente formulario para recibir ayuda.
                                    Nos pondremos en contacto contigo lo antes posible.
                                </Paragraph>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="name"
                                        label="Nombre completo"
                                        rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label="Correo electrónico"
                                        rules={[
                                            { required: true, message: 'Por favor ingresa tu email' },
                                            { type: 'email', message: 'Por favor ingresa un email válido' }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="category"
                                        label="Categoría del problema"
                                        rules={[{ required: true, message: 'Por favor selecciona una categoría' }]}
                                    >
                                        <Select
                                            placeholder="Selecciona una categoría"
                                            options={categories}
                                        />
                                    </Form.Item>



                                    <Form.Item
                                        name="subject"
                                        label="Asunto"
                                        rules={[{ required: true, message: 'Por favor ingresa un asunto' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="description"
                                        label="Descripción del problema"
                                        rules={[{ required: true, message: 'Por favor describe tu problema' }]}
                                    >
                                        <Input.TextArea
                                            rows={4}
                                            placeholder="Describe tu problema con el mayor detalle posible..."
                                        />
                                    </Form.Item>



                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="bg-blue-600">
                                            Enviar solicitud
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        )
                }

            </Layout.Content>
        </Layout>
    );
}

export default SupportPage;