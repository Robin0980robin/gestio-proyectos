import { Button, Card, Col, Form, Input, Layout, List, message, Modal, Row, Select, Tag, Typography, Upload } from "antd"
import { useEffect, useState } from "react"
import { projectsStorage } from "../storage/projectsStorage"
import useAuthStore from "../stores/authStore"
import Header from "../components/Header"
import Footer from "../components/Footer"

function MyProjectsPage() {
    const [form] = Form.useForm()
    const currentUser = useAuthStore(state => state.currentUser)
    let projects = projectsStorage.getProjects()
    let projectsByCurrentUser = projects.length === 0 ? [] : projects.filter((project) => project.userId === currentUser.id)

    const [openForm, setOpenForm] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [refresh, setRefresh] = useState(false)

    function handleForm(isOpen) {
        setOpenForm(isOpen)
    }

    async function handleFinish(values) {
        console.log('values', values)
        const file = values.file.length > 0 ? values.file[0].originFileObj : null;
        if (selectedProject) {
            const updateProject = await projectsStorage.updateProject(selectedProject.id, {
                ...values,
                userId: currentUser.id
            }, file)
            if (updateProject.status) {
                message.success("Proyecto actualizado exitosamente")
                handleForm(false)
            }
        } else {
            console.log('file', file)
            const addProject = await projectsStorage.saveProject({
                name: values.name,
                status: values.status,
                userId: currentUser.id
            }, file)
            console.log('add projoect', addProject)
            if (addProject.status) {
                message.success("Proyecto creado exitosamente")
                handleForm(false)
            } else {
                message.error(result.message);
            }
        }

    }


    const handleEditModal = (project) => {
        handleForm(true)
        setSelectedProject(project)
        form.setFieldValue("name", project.name)
        form.setFieldValue("status", project.status)
    }

    const handleCreateModal = () => {
        handleForm(true)
        setSelectedProject(null)
        form.resetFields()
    }

    const handleDeleteProject = (project) => {
        const deleteProject = projectsStorage.deleteProject(project.id)
        if (deleteProject.status) {
            message.success("Proyecto eliminado exitosamente")
            setRefresh(true)
        }
    }

    useEffect(() => {
        if (refresh) {
            projects = projectsStorage.getProjects()
            projectsByCurrentUser = projects.length === 0 ? [] : projects.filter((project) => project.userId === currentUser.id)
            setRefresh(false)
        }
    }, [refresh])


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const handlePreview = (projectId) => {
        const fileUrl = projectsStorage.getFileUrl(projectId);
        if (fileUrl) {
            setPreviewFile(fileUrl);
            setPreviewOpen(true);
        } else {
            message.info('Este proyecto no tiene archivo adjunto');
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList?.slice(-1);
    };

    return (
        <Layout>
            <Header />
            <Card
                title="Mis Proyectos"
                extra={<Button onClick={handleCreateModal} type="primary">Agregar Proyecto</Button>}
            >
                {projectsByCurrentUser.length > 0 ?
                    <List
                        loading={refresh}
                        bordered
                        dataSource={projectsByCurrentUser}
                        renderItem={project => (
                            <List.Item>
                                <Row  style={{ width: '80%'}}>
                                    <Col span={8}>
                                        <div>
                                            Nombre: {project.name}
                                        </div>
                                        Estado: {project.status === "IN_PROGRESS" ? (
                                            <Tag color="processing">En Progreso</Tag>
                                        ) : (
                                            <Tag color="success">Finalizado</Tag>
                                        )}
                                        <div>
                                            ¿Avances aprobados?: {'checked' in project && project.checked ? 'Sí' : 'No'}
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        {'comments' in project && (
                                            <div>
                                                Comentarios:
                                                {project.comments.length > 0 &&
                                                    project.comments.map((c) =>
                                                        <p>{c.author.name}: {c.content}</p>
                                                    )
                                                }
                                            </div>
                                        )}
                                    </Col>
                                    <Col span={8}>
                                        <a style={{ display: 'block'}} onClick={() => handlePreview(project.id)} key="list-loadmore-edit">Ver adjunto</a>
                                        <a style={{ display: 'block'}} onClick={() => handleEditModal(project)} key="list-loadmore-edit">Editar</a>
                                        <a style={{ display: 'block'}} onClick={() => handleDeleteProject(project)} key="list-loadmore-edit">Eliminar</a>
                                    </Col>
                                </Row>




                            </List.Item>)}

                    />
                    :
                    <Typography.Text>Aún no tienes proyectos</Typography.Text>
                }
                <Modal footer={null} title={selectedProject ? "Editar Proyecto" : "Crear Proyecto"} open={openForm} onClose={() => handleForm(false)} onCancel={() => handleForm(false)} >
                    <Form form={form} onFinish={handleFinish}>
                        <Form.Item label="Nombre" name="name"
                            rules={[
                                { required: true, message: 'Por favor ingresa el nombre del proyecto' },
                            ]}
                        >
                            <Input placeholder="Nombre del proyecto.." />
                        </Form.Item>
                        <Form.Item label="Estado" name="status"
                            rules={[
                                { required: true, message: 'Por favor ingrese el estado del proyecto' },
                            ]}
                        >
                            <Select options={[
                                { label: "En progreso", value: "IN_PROGRESS" },
                                { label: "Finalizado", value: "FINISHED" },
                            ]} />

                        </Form.Item>
                        <Form.Item
                            name="file"
                            label="Archivo"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <Button>Seleccionar Archivo</Button>
                            </Upload>
                        </Form.Item>
                        <Row justify="end">
                            <Form.Item>
                                <Button htmlType="submit" type="primary">Guardar</Button>
                            </Form.Item>
                        </Row>
                    </Form>
                </Modal>


                <Modal
                    open={previewOpen}
                    title="Vista previa del archivo"
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                    width={800}
                >
                    {previewFile && (
                        previewFile.startsWith('data:image') ? (
                            <img
                                alt="preview"
                                style={{ width: '100%' }}
                                src={previewFile}
                            />
                        ) : (
                            <iframe
                                src={previewFile}
                                style={{ width: '100%', height: '500px' }}
                                title="preview"
                            />
                        )
                    )}
                </Modal>

            </Card>
        </Layout>
    )
}

export default MyProjectsPage