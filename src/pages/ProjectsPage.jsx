import { Button, Card, Col, Form, Input, Layout, List, message, Modal, Row, Select, Tag, Typography, Upload } from "antd"
import { useEffect, useState } from "react"
import { projectsStorage } from "../storage/projectsStorage"
import useAuthStore from "../stores/authStore"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CommentInput from "../components/CommentInput"
import ApproveInput from "../components/ApproveInput"

function ProjectsPage() {
    const [refresh, setRefresh] = useState(false)
    let projects = projectsStorage.getProjects()

    useEffect(() => {
        if (refresh) {
            projects = projectsStorage.getProjects()
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


    return (
        <Layout>
            <Header />
            <Card title="Proyectos">
                {projects.length > 0 ?
                    <div>
                        {projects.map((project) =>
                            <Card title={project.name} extra={
                                <div>
                                    {project.status === "IN_PROGRESS" ? (
                                        <Tag color="processing">En Progreso</Tag>
                                    ) : (
                                        <Tag color="success">Finalizado</Tag>
                                    )
                                    }
                                    <a onClick={() => handlePreview(project.id)} key="list-loadmore-edit">Ver adjunto</a>
                                </div>
                            }>
                                <ApproveInput project={project} />

                                <div style={{ marginTop: 12 }}>
                                <CommentInput project={project} setRefresh={setRefresh} />
                                </div>
                                {'comments' in project && (
                                    <div>
                                        {project.comments.length > 0 &&
                                            project.comments.map((c) =>
                                                <p>{c.author.name}: {c.content}</p>
                                            )
                                        }
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>

                    :
                    <Typography.Text>Aún no hay proyectos</Typography.Text>
                }
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

export default ProjectsPage