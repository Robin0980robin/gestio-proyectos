import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Row, Col, Typography, Card, Tag, Button, Rate, Space, List, Avatar, Divider, message, Modal } from 'antd';
import { UserOutlined, ClockCircleOutlined, BookOutlined, CheckOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import { coursesStorage } from '../storage/coursesStorage';
import useAuthStore from '../stores/authStore';
import { usersStorage } from '../storage/usersStorage';

const { Title, Paragraph, Text } = Typography;

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const course = coursesStorage.getCourses().find(c => c.id === parseInt(courseId));
    const currentUser = useAuthStore(state => state.currentUser)

    const user = usersStorage.getUsers().find((u) => u.id === currentUser.id)

    const [currentUserIsInCourse, setCurrentUserIsInCourse] = useState(user.courses.find((c) => c.id === course.id))

    if (!course) {
        return <div>Curso no encontrado</div>;
    }


    const handleJoinCourse = () => {
        course.students.push(currentUser)
        const updateCourseResult = coursesStorage.updateCourse(course.id, course)

        user.courses.push(course)
        const updateUserResult = usersStorage.updateUser(user.id, user)

        console.log('u', updateCourseResult)
        console.log('a', updateUserResult)
        if (updateCourseResult.status && updateUserResult.status) {
            message.success("Inscripción exitosa")
            setCurrentUserIsInCourse(true)
        }

    }

    const [showModalLesson, setShowModalLesson] = useState(false)

    return (
        <Layout>
            <Header />
            <Layout.Content style={{ height: '100vh' }}>
                <Row gutter={[24, 24]} className="max-w-7xl mx-auto" style={{ marginTop: 16 }}>
                    <Col xs={24} lg={16}>
                        <Space direction="vertical" size="large" className="w-full">
                            <div>
                                <Title>{course.title}</Title>
                                <Paragraph className="text-lg">{course.description}</Paragraph>

                                <Space size="large" wrap>
                                    <span>
                                        <ClockCircleOutlined className="mr-2" />
                                        {course.duration}
                                    </span>
                                    <span>
                                        <UserOutlined className="mr-2" />
                                        {course.students.length ?? 0} estudiantes
                                    </span>

                                </Space>
                            </div>


                            <Card>
                                <Title level={3}>Contenido del curso</Title>
                                <List
                                    itemLayout="vertical"
                                    dataSource={course.lections}
                                    renderItem={(lesson, index) => (
                                        <List.Item actions={
                                            currentUserIsInCourse ? [
                                                <Button onClick={() => setShowModalLesson(true)} type="primary" icon={<EyeOutlined />} >Ver lección</Button>
                                            ] : []
                                        } >
                                            <BookOutlined className="mr-2" />
                                            {lesson}
                                            <Modal onCancel={() => setShowModalLesson(false)} onClose={() => setShowModalLesson(false)}   width="90%" title={lesson} open={showModalLesson} footer={null}>
                                                <iframe
                                                    width="100%"
                                                    height="480"
                                                    src="https://www.youtube.com/embed/3nYLTiY5skU?si=7orUdGoxMJP5yR7T"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title="Embedded youtube"
                                                />
                                            </Modal>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Space>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card className="sticky top-6">
                            <Space direction="vertical" size="large" className="w-full">
                                <Title level={2}>${course.price}</Title>
                                <Button disabled={currentUserIsInCourse}
                                    onClick={handleJoinCourse} type="primary" size="large" block className="bg-blue-600">
                                    {currentUserIsInCourse ? "Ya estás inscrito en este curso" : "Inscribirse ahora"}
                                </Button>
                                <div>
                                    <Title level={4}>Instructor</Title>
                                    <Space>
                                        <div>
                                            <Title level={5}>{course.instructor.name}</Title>
                                        </div>
                                    </Space>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Layout.Content>

        </Layout>
    );
};

export default CourseDetailPage;