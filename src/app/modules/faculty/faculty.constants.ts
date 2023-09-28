export const facultyFilterableFields: string[] = [
    'searchTerm',
    'facultyId',
    'email',
    'contactNo',
    'gender',
    'bloodGroup',
    'gender',
    'designation',
    'academicFacultyId',
    'academicDepartmentId'
];

export const facultySearchableFields: string[] = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'facultyId',
    'designation'
];

export const facultyRelationalFields: string[] = ['academicFacultyId', 'academicDepartmentId'];
export const facultyRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
    academicDepartmentId: 'academicDepartment'
};

export const EVENT_FACULTY_CREATED = 'faculty.created'
export const EVENT_FACULTY_UPDATED = 'faculty.updated'