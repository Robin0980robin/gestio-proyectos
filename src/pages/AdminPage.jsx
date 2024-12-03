import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Layout, message, Modal, Select, Table } from "antd"
import Header from "../components/Header"
import { coursesStorage } from "../storage/coursesStorage";
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import categoriesData from '../data/categories.json'
import useAuthStore from "../stores/authStore";

const AdminPage = () => {

    const categories = categoriesData.categories;
    const currentUser = useAuthStore(state => state.currentUser)

    const categoriesToSelect = categories.map((category) => {
        return {
            label: category.name,
            value: category.id
        }
    })
    const [refresh, setRefresh] = useState(false)
    const [courses, setCourses] = useState(coursesStorage.getCourses())
    const [showModal, setShowModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [form] = Form.useForm()

    useEffect(() => {
        if (refresh) {
            setCourses(coursesStorage.getCourses())
            setRefresh(false)
        }
    }, [refresh])

    const handleShowModal = (record = null) => {
        console.log('record', record)
        setShowModal(true)
        if (record !== null) {
            setSelectedCourse(record)
            form.setFieldValue("title", record.title)
            form.setFieldValue("description", record.description)
            form.setFieldValue("duration", record.duration)
            form.setFieldValue("price", record.price)
            form.setFieldValue("category_id", record.category_id)
            form.setFieldValue("lections", record.lections)
        } else {
            form.resetFields()
            setSelectedCourse(null)
        }
    }

    const columns = [
        {
            title: 'Nombre',
            key: 'title',
            dataIndex: 'title',
        },
        {
            title: 'Descripción',
            key: 'description',
            dataIndex: 'description'
        },
        {
            title: 'Duración',
            key: 'duration',
            dataIndex: 'duration'
        },
        {
            title: 'Precio',
            key: 'price',
            dataIndex: 'price'
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (record) => (
                <Button icon={<EditOutlined />} onClick={() => handleShowModal(record)} />
            )
        }
    ]

    const handleSubmit = (values) => {
        console.log('values', values)
        const fullData = {
            ...values,
            instructor: currentUser
        }
        const saveCourseResult = selectedCourse !== null ? coursesStorage.updateCourse(selectedCourse.id, fullData) : coursesStorage.saveCourse(fullData)
        console.log('save', saveCourseResult)
        if (saveCourseResult.status) {
            message.success("Curso guardado exitosamente")
            form.resetFields()
            setShowModal(false)
            setRefresh(true)
        }
    }

    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh' }} >
                <Card title="Cursos" extra={<Button type="primary" onClick={() => handleShowModal()}>Agregar curso</Button>}>
                    <Table dataSource={courses} columns={columns} />
                </Card>
            </Layout.Content>
            <Modal title={selectedCourse !== null ? "Editar Curso" : "Agregar Curso"} open={showModal} footer={null} onClose={() => setShowModal(false)} onCancel={() => setShowModal(false)} >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item label="Nombre" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Descripción" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Duración" name="duration">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Precio" name="price">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Categoría" name="category_id">
                        <Select options={categoriesToSelect} />
                    </Form.Item>

                    <Form.List
                        name="lections"
                        rules={[
                            {
                                validator: async (_, lections) => {
                                    if (!lections || lections.length < 2) {
                                        return Promise.reject(new Error('Deben existir al menos dos lecciones'));
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        //{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? 'Lecciones' : ''}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "Por favor ingrese el nombre de la lección.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input placeholder="Nombre de lección" style={{ width: '90%' }} />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '60%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        Agregar lección
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Button htmlType="submit" type="primary">
                        Guardar
                    </Button>
                </Form>
            </Modal>
        </Layout>
    )
}

export default AdminPage;