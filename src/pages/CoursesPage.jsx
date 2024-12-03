import { BookOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Layout, Row, Tag, Typography } from "antd";
import Navbar from "../components/Navbar";
import coursesData from '../data/public_courses.json'
import categoriesData from '../data/categories.json'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useAuthStore from "../stores/authStore";
import { coursesStorage } from "../storage/coursesStorage";

const { Title, Paragraph } = Typography

const CoursesPage = () => {
    const navigate = useNavigate()

    const courses = coursesStorage.getCourses();
    const categories = categoriesData.categories;

    const [filteredCourses, setFilteredCourses] = useState(courses)

    const [selectedCategory, setSelectedCategory] = useState(null)

    const handleSelectCategory = (category, checked) => {
        if (checked) {
            setSelectedCategory(category)

            const couresByCategory = courses.filter((course) => course.category_id === category.id)
            setFilteredCourses(couresByCategory)
        }
    }

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };


    return (
        <Layout>
            <Header />
            <Layout.Content style={{ minHeight: '100vh' }} >
                <Row justify="center" style={{ marginTop: 16 }}>
                    <Title>Cursos</Title>
                </Row>
                <Row justify="center">
                    <Flex gap={4} wrap align="center">
                        <span>Selecciona una categoría:</span>
                        {categories.map((category) => (
                            <Tag.CheckableTag
                                key={category.id}
                                checked={selectedCategory !== null ? selectedCategory.id === category.id : false}
                                onChange={(checked) => handleSelectCategory(category, checked)}
                            >
                                {category.name}
                            </Tag.CheckableTag>
                        ))}
                    </Flex>
                </Row>
                <Row justify="center" style={{ marginTop: 20}} >
                    {filteredCourses && filteredCourses.length > 0 && filteredCourses.map((course, index) => (
                        <Col span={6}>
                            <Card
                                key={index}
                                hoverable
                                onClick={() => handleCourseClick(course.id)}
                            >
                                <div className="h-40 bg-gray-200 mb-4 rounded flex items-center justify-center">
                                    <BookOutlined className="text-4xl text-gray-400" />
                                </div>
                                <Title level={4}>{course.title}</Title>
                                <Paragraph className="text-gray-600">
                                    {course.description}
                                </Paragraph>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{course?.students?.length ?? 0} estudiantes</span>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Layout.Content>
        </Layout>
    )
}

export default CoursesPage;