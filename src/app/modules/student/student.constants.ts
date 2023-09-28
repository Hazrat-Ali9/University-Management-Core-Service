export const studentFilterableFields: string[] = [
    'searchTerm',
    'studentId',
    'email',
    'contactNo',
    'gender',
    'bloodGroup',
    'gender',
    'academicFacultyId',
    'academicDepartmentId',
    'academicSemesterId'
];

export const studentSearchableFields: string[] = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'studentId'
];

export const studentRelationalFields: string[] = [
    'academicFacultyId',
    'academicDepartmentId',
    'academicSemesterId'
];
export const studentRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
    academicDepartmentId: 'academicDepartment',
    academicSemesterId: 'academicSemester'
};

export const EVENT_STUDENT_CREATED = 'student.created'
export const EVENT_STUDENT_UPDATED = 'student.updated'