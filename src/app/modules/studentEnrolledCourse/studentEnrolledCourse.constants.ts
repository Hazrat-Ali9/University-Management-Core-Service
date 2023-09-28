export const studentEnrolledCourseFilterableFields: string[] = [
    'academicSemesterId',
    'studentId',
    'courseId',
    'status',
    'grade'
];

export const studentEnrolledCourseSearchableFields: string[] = [];

export const studentEnrolledCourseRelationalFields: string[] = [
    'academicSemesterId',
    'studentId',
    'courseId'
];
export const studentEnrolledCourseRelationalFieldsMapper: { [key: string]: string } = {
    academicSemesterId: 'academicSemester',
    studentId: 'student',
    courseId: 'course'
};