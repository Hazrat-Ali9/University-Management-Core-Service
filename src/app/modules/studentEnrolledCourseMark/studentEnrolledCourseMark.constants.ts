export const studentEnrolledCourseMarkFilterableFields: string[] = [
    'academicSemesterId',
    'studentId',
    'studentEnrolledCourseId',
    'examType',
    'courseId'
];

export const studentEnrolledCourseMarkSearchableFields: string[] = ['examType', 'grade'];

export const studentEnrolledCourseMarkRelationalFields: string[] = [
    'academicSemesterId',
    'studentId',
    'studentEnrolledCourseId'
];
export const studentEnrolledCourseMarkRelationalFieldsMapper: { [key: string]: string } = {
    academicSemesterId: 'academicSemester',
    studentId: 'student',
    studentEnrolledCourseId: 'studentEnrolledCourse'
};