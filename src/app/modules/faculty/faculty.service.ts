import { CourseFaculty, Faculty, Prisma, Student } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { facultyRelationalFields, facultyRelationalFieldsMapper, facultySearchableFields } from "./faculty.constants";
import { FacultyCreatedEvent, IFacultyFilterRequest, IFacultyMyCourseStudentsRequest } from "./faculty.interface";

const insertIntoDB = async (data: Faculty): Promise<Faculty> => {
    const result = await prisma.faculty.create({
        data,
        include: {
            academicFaculty: true,
            academicDepartment: true
        }
    });
    return result;
};

const getAllFromDB = async (
    filters: IFacultyFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: facultySearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (facultyRelationalFields.includes(key)) {
                    return {
                        [facultyRelationalFieldsMapper[key]]: {
                            id: (filterData as any)[key]
                        }
                    };
                } else {
                    return {
                        [key]: {
                            equals: (filterData as any)[key]
                        }
                    };
                }
            })
        });
    }

    const whereConditions: Prisma.FacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.faculty.findMany({
        include: {
            academicFaculty: true,
            academicDepartment: true
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc'
                }
    });
    const total = await prisma.faculty.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const getByIdFromDB = async (id: string): Promise<Faculty | null> => {
    const result = await prisma.faculty.findFirst({
        where: {
            facultyId: id
        },
        include: {
            academicFaculty: true,
            academicDepartment: true
        }
    });
    return result;
};

const updateOneInDB = async (id: string, payload: Partial<Faculty>): Promise<Faculty> => {
    const result = await prisma.faculty.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicFaculty: true,
            academicDepartment: true
        }
    });
    return result;
};

const deleteByIdFromDB = async (id: string): Promise<Faculty> => {
    const result = await prisma.faculty.delete({
        where: {
            id
        },
        include: {
            academicFaculty: true,
            academicDepartment: true
        }
    });
    return result;
};

const assignCourses = async (
    id: string,
    payload: string[]
): Promise<CourseFaculty[]> => {
    await prisma.courseFaculty.createMany({
        data: payload.map((courseId) => ({
            facultyId: id,
            courseId: courseId
        }))
    })

    const assignCoursesData = await prisma.courseFaculty.findMany({
        where: {
            facultyId: id
        },
        include: {
            course: true
        }
    })

    return assignCoursesData;
}

const removeCourses = async (
    id: string,
    payload: string[]
): Promise<CourseFaculty[] | null> => {
    await prisma.courseFaculty.deleteMany({
        where: {
            facultyId: id,
            courseId: {
                in: payload
            }
        }
    })

    const assignCoursesData = await prisma.courseFaculty.findMany({
        where: {
            facultyId: id
        },
        include: {
            course: true
        }
    })

    return assignCoursesData
}

const myCourses = async (
    authUser: {
        userId: string,
        role: string
    },
    filter: {
        academicSemesterId?: string | null | undefined,
        courseId?: string | null | undefined
    }
) => {
    if (!filter.academicSemesterId) {
        const currentSemester = await prisma.academicSemester.findFirst({
            where: {
                isCurrent: true
            }
        });

        filter.academicSemesterId = currentSemester?.id
    }

    const offeredCourseSections = await prisma.offeredCourseSection.findMany({
        where: {
            offeredCourseClassSchedules: {
                some: {
                    faculty: {
                        facultyId: authUser.userId
                    }
                }
            },
            offeredCourse: {
                semesterRegistration: {
                    academicSemester: {
                        id: filter.academicSemesterId
                    }
                }
            }
        },
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            },
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true
                        }
                    }
                }
            }
        }
    });

    const couseAndSchedule = offeredCourseSections.reduce((acc: any, obj: any) => {
        //console.log(obj)

        const course = obj.offeredCourse.course;
        const classSchedules = obj.offeredCourseClassSchedules

        const existingCourse = acc.find((item: any) => item.couse?.id === course?.id);
        if (existingCourse) {
            existingCourse.sections.push({
                section: obj,
                classSchedules
            })
        }
        else {
            acc.push({
                course,
                sections: [
                    {
                        section: obj,
                        classSchedules
                    }
                ]
            })
        }
        return acc;
    }, []);
    return couseAndSchedule;
};

const getMyCourseStudents = async (
    filters: IFacultyMyCourseStudentsRequest,
    options: IPaginationOptions,
    authUser: any
): Promise<IGenericResponse<Student[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    console.log(authUser)
    if (!filters.academicSemesterId) {
        const currentAcademicSemester = await prisma.academicSemester.findFirst({
            where: {
                isCurrent: true
            }
        });

        if (currentAcademicSemester) {
            filters.academicSemesterId = currentAcademicSemester.id;
        }
    }

    const offeredCourseSections = await prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId
                }
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId
                        }
                    }
                },
                id: filters.offeredCourseSectionId
            }
        },
        include: {
            student: true
        },
        take: limit,
        skip
    });

    const students = offeredCourseSections.map(
        (offeredCourseSection) => offeredCourseSection.student
    );

    const total = await prisma.studentSemesterRegistrationCourse.count({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId
                }
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId
                        }
                    }
                },
                id: filters.offeredCourseSectionId
            }
        }
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: students
    };
};

const createFacultyFromEvent = async (e: FacultyCreatedEvent): Promise<void> => {
    const faculty: Partial<Faculty> = {
        facultyId: e.id,
        firstName: e.name.firstName,
        lastName: e.name.lastName,
        middleName: e.name.middleName,
        profileImage: e.profileImage,
        email: e.email,
        contactNo: e.contactNo,
        gender: e.gender,
        bloodGroup: e.bloodGroup,
        designation: e.designation,
        academicDepartmentId: e.academicDepartment.syncId,
        academicFacultyId: e.academicFaculty.syncId
    };

    const data = await insertIntoDB(faculty as Faculty);
    console.log("RES: ", data);
};

const updateFacultyFromEvent = async (e: any): Promise<void> => {
    const isExist = await prisma.faculty.findFirst({
        where: {
            facultyId: e.id
        }
    });
    if (!isExist) {
        createFacultyFromEvent(e);
    }
    else {
        const facultyData: Partial<Faculty> = {
            facultyId: e.id,
            firstName: e.name.firstName,
            lastName: e.name.lastName,
            middleName: e.name.middleName,
            profileImage: e.profileImage,
            email: e.email,
            contactNo: e.contactNo,
            gender: e.gender,
            bloodGroup: e.bloodGroup,
            designation: e.designation,
            academicDepartmentId: e.academicDepartment.syncId,
            academicFacultyId: e.academicFaculty.syncId
        };

        const res = await prisma.faculty.updateMany({
            where: {
                facultyId: e.id
            },
            data: facultyData
        });
        console.log(res)
    }
}

export const FacultyService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    assignCourses,
    removeCourses,
    myCourses,
    getMyCourseStudents,
    createFacultyFromEvent,
    updateFacultyFromEvent
};