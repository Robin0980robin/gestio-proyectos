import { Button, Card, Col, Layout, List, message, Row, Spin, Tag, Typography } from "antd"
import Header from "../components/Header"
import useAuthStore from "../stores/authStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { usersStorage } from "../storage/usersStorage"
import { projectsStorage } from "../storage/projectsStorage"

const ResumePage = () => {

    const currentUser = useAuthStore(state => state.currentUser)
    const user = usersStorage.getUsers().find((u) => u.id === currentUser.id)
    const navigate = useNavigate()
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        if (currentUser.isTeacher) {
            navigate("/projects")
        }
    }, [currentUser])

    console.log('current user', user)

    const handleFinish = (courseId) => {
        const courseInUserIndex = user.courses.findIndex((c) => c.id === courseId)
        if (courseInUserIndex !== -1) {
            user.courses[courseInUserIndex] = {
                ...user.courses[courseInUserIndex],
                isFinished: true
            }
            usersStorage.updateUser(user.id, user)
            setRefresh(true)
            setTimeout(() => {
                setRefresh(false)
            }, 2000)
        }
    }

    const isFinished = (courseId) => {
        const courseInUserIndex = user.courses.findIndex((c) => c.id === courseId)
        if (courseInUserIndex !== -1) {
            return user.courses[courseInUserIndex].isFinished
        }
    }


    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const projects = projectsStorage.getProjects()
    const projectsByCurrentUser = projects.length === 0 ? [] : projects.filter((project) => project.userId === currentUser.id)


    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh', marginLeft: 16, marginRight: 16 }}>
                <Typography.Title>Bienvenido {user.name}</Typography.Title>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Card onClick={() => navigate("/my-projects")} hoverable={true} title={<Typography.Title>Mis Proyectos</Typography.Title>} bordered={false}>
                                <Typography.Paragraph style={{ fontSize: 20 }}>
                                    Tienes {projectsByCurrentUser.length} proyectos en curso <a>Detalles</a>
                                </Typography.Paragraph>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card onClick={() => navigate("/my-profile")} hoverable={true} title={<Typography.Title>Mi Perfil</Typography.Title>} bordered={false}>
                                <Typography.Paragraph style={{ fontSize: 20 }} >
                                    Recuerda mantener actualizado tu perfil <a>Actualizar ahora</a>
                                </Typography.Paragraph>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card  onClick={() => navigate("/my-projects")} hoverable={true} title={<Typography.Title>Comentarios</Typography.Title>} bordered={false}>
                                <Typography.Paragraph style={{ fontSize: 20 }} >
                                    Tienes comentarios en tus proyectos <a>Detalles</a>
                                </Typography.Paragraph>
                            </Card>
                        </Col>
                    </Row>


            </Layout.Content>
        </Layout>
    )
}

export default ResumePage