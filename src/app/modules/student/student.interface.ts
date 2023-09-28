export type IStudentFilterRequest = {
    searchTerm?: string | undefined;
    academicFacultyId?: string | undefined;
    academicDepartmentId?: string | undefined;
    academicSemesterId?: string | undefined;
    studentId?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
    gender?: string | undefined;
    bloodGroup?: string | undefined;
}

export type IStudentMyCoursesRequest = {
    academicSemesterId?: string | undefined;
    courseId?: string | undefined;
}

export type IStudentMyCourseSchedulesRequest = {
    academicSemesterId?: string | undefined;
    courseId?: string | undefined;
}

export type StudentCreatedEvent = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    email: string;
    contactNo: string;
    profileImage: string;
    academicFaculty: {
        syncId: string;
    };
    academicDepartment: {
        syncId: string;
    };
    academicSemester: {
        syncId: string;
    };
};

export type StudentUpdatedEvent = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    email: string;
    contactNo: string;
    profileImage: string;
    academicFaculty: {
        syncId: string;
    };
    academicDepartment: {
        syncId: string;
    };
    academicSemester: {
        syncId: string;
    };
};