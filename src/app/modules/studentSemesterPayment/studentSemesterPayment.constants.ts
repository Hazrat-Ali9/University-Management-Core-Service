export const studentSemesterPaymentFilterableFields: string[] = ['academicSemesterId', 'studentId'];

export const studentSemesterPaymentSearchableFields: string[] = [];

export const studentSemesterPaymentRelationalFields: string[] = ['academicSemesterId', 'studentId'];
export const studentSemesterPaymentRelationalFieldsMapper: { [key: string]: string } = {
    academicSemesterId: 'academicSemester',
    studentId: 'student'
};