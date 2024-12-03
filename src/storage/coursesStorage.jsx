export const coursesStorage = {
    getCourses: () => {
        const courses = localStorage.getItem('courses');
        return courses ? JSON.parse(courses) : [];
    },

    saveCourse: (courseData) => {
        const courses = coursesStorage.getCourses()

        const newCourse = {
            ...courseData,
            students: [],
            id: courses.length,
        };

        courses.push(newCourse)

        localStorage.setItem('courses', JSON.stringify(courses));

        return {
            status: true,
            course: newCourse
        }
    },

    updateCourse: (courseId, updateData) => {
        const courses = coursesStorage.getCourses();
        const courseIndex = courses.findIndex(course => course.id === courseId);

        if (courseIndex === -1) {
            return {
                status: false,
                message: "Curso no encontrado"
            }
        }

        const updatedCourse = {
            ...courses[courseIndex],
            ...updateData
        };

        courses[courseIndex] = updatedCourse

        localStorage.setItem('courses', JSON.stringify(courses));

        return {
            status: true,
            course: updatedCourse
        }
    }
};