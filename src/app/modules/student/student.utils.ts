const groupByAcademicSemester = (data: any) => {
    const groupData = data.reduce((result: any, course: any) => {
        const academicSemester = course.academicSemester;
        const academicSemesterId = academicSemester.id;

        const existingGroup = result.find(
            (group: any) => group.academicSemester.id === academicSemesterId
        );

        if (existingGroup) {
            existingGroup.completedCourses.push({
                id: course.id,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                courseId: course.courseId,
                studentId: course.studentId,
                grade: course.grade,
                point: course.point,
                totalMarks: course.totalMarks,
                course: course.course
            });
        }
        else {
            result.push({
                academicSemester,
                completedCourses: [
                    {
                        id: course.id,
                        createdAt: course.createdAt,
                        updatedAt: course.updatedAt,
                        courseId: course.courseId,
                        studentId: course.studentId,
                        grade: course.grade,
                        point: course.point,
                        totalMarks: course.totalMarks,
                        course: course.course
                    }
                ]
            })
        }
        return result;
    }, []);
    return groupData;
}

export const StudentUtils = {
    groupByAcademicSemester
}