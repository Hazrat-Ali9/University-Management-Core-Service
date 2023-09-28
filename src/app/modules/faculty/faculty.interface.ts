
export type IFacultyFilterRequest = {
    searchTerm?: string | undefined;
    academicFacultyId?: string | undefined;
    academicDepartmentId?: string | undefined;
    studentId?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
    gender?: string | undefined;
    bloodGroup?: string | undefined;
}


export type IFacultyMyCourseStudentsRequest = {
    academicSemesterId?: string | undefined;
    courseId?: string | undefined;
    offeredCourseSectionId?: string | undefined;
};

export type FacultyCreatedEvent = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    designation: string;
    email: string;
    contactNo: string;
    profileImage: string;
    academicFaculty: {
        syncId: string;
    };
    academicDepartment: {
        syncId: string;
    };
};