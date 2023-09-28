import { Course, OfferedCourse, Prisma, SemesterRegistration, SemesterRegistrationStatus, StudentEnrolledCourseStatus, StudentSemesterRegistration, StudentSemesterRegistrationCourse } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { StudentEnrolledCourseMarkService } from "../studentEnrolledCourseMark/studentEnrolledCourseMark.service";
import { StudentSemesterPaymentService } from "../studentSemesterPayment/studentSemesterPayment.service";
import { studentSemesterRegistrationCourseService } from "../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service";
import { semesterRegistrationRelationalFields, semesterRegistrationRelationalFieldsMapper, semesterRegistrationSearchableFields } from "./semesterRegistration.constants";
import { IEnrollCoursePayload, ISemesterRegistrationFilterRequest } from "./semesterRegistration.interface";
import { SemesterRegistrationUtils } from "./semesterRegistration.utils";

const insertIntoDB = async (data: SemesterRegistration): Promise<SemesterRegistration> => {

    const isAnySemesterRegUpcomingOrOngoing = await prisma.semesterRegistration.findFirst({
        where: {
            OR: [
                {
                    status: SemesterRegistrationStatus.UPCOMING
                },
                {
                    status: SemesterRegistrationStatus.ONGOING
                }
            ]
        }
    })

    if (isAnySemesterRegUpcomingOrOngoing) {
        throw new ApiError(httpStatus.BAD_REQUEST,
            `Thers is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration.`
        )
    }

    const result = await prisma.semesterRegistration.create({
        data
    })

    return result;
}

const getAllFromDB = async (
    filters: ISemesterRegistrationFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: semesterRegistrationSearchableFields.map((field) => ({
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
                if (semesterRegistrationRelationalFields.includes(key)) {
                    return {
                        [semesterRegistrationRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.SemesterRegistrationWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.semesterRegistration.findMany({
        include: {
            academicSemester: true
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
    const total = await prisma.semesterRegistration.count({
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

const getByIdFromDB = async (id: string): Promise<SemesterRegistration | null> => {
    const result = await prisma.semesterRegistration.findUnique({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });
    return result;
};

// UPCOMING > ONGOING  > ENDED

const updateOneInDB = async (
    id: string,
    payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {

    console.log(payload.status);
    const isExist = await prisma.semesterRegistration.findUnique({
        where: {
            id
        }
    })

    if (!isExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Data not found!")
    }

    if (payload.status && isExist.status === SemesterRegistrationStatus.UPCOMING && payload.status !== SemesterRegistrationStatus.ONGOING) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Can only move from UPCOMING to ONGOING")
    }

    if (payload.status && isExist.status === SemesterRegistrationStatus.ONGOING && payload.status !== SemesterRegistrationStatus.ENDED) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Can only move from ONGOING to ENDED")
    }

    const result = await prisma.semesterRegistration.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicSemester: true
        }
    })

    return result;
}

const deleteByIdFromDB = async (id: string): Promise<SemesterRegistration> => {
    const result = await prisma.semesterRegistration.delete({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });
    return result;
};

const startMyRegistration = async (authUserId: string): Promise<{
    semesterRegistration: SemesterRegistration | null,
    studentSemesterRegistration: StudentSemesterRegistration | null
}> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            studentId: authUserId
        }
    })
    if (!studentInfo) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Student Info not found!")
    }

    const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [SemesterRegistrationStatus.ONGOING, SemesterRegistrationStatus.UPCOMING]
            }
        }
    })

    if (semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Registration is not started yet")
    }

    let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
        where: {
            student: {
                id: studentInfo?.id
            },
            semesterRegistration: {
                id: semesterRegistrationInfo?.id
            }
        }
    })


    if (!studentRegistration) {
        studentRegistration = await prisma.studentSemesterRegistration.create({
            data: {
                student: {
                    connect: {
                        id: studentInfo?.id
                    }
                },
                semesterRegistration: {
                    connect: {
                        id: semesterRegistrationInfo?.id
                    }
                }
            }
        })
    }

    return {
        semesterRegistration: semesterRegistrationInfo,
        studentSemesterRegistration: studentRegistration
    }
}

const enrollIntoCourse = async (
    authUserId: string,
    payload: IEnrollCoursePayload
): Promise<{
    message: string
}> => {
    return studentSemesterRegistrationCourseService.enrollIntoCourse(authUserId, payload)
}

const withdrewFromCourse = async (
    authUserId: string,
    payload: IEnrollCoursePayload
): Promise<{
    message: string
}> => {
    return studentSemesterRegistrationCourseService.withdrewFromCourse(authUserId, payload)
}

const confirmMyRegistration = async (authUserId: string): Promise<{ message: string }> => {
    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: SemesterRegistrationStatus.ONGOING
        }
    })

    // 3 - 6
    const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration?.id
            },
            student: {
                studentId: authUserId
            }
        }
    })

    if (!studentSemesterRegistration) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You are not recognized for this semester!")
    }

    if (studentSemesterRegistration.totalCreditsTaken === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You are not enrolled in any course!")
    }

    if (
        studentSemesterRegistration.totalCreditsTaken &&
        semesterRegistration?.minCredit &&
        semesterRegistration.maxCredit &&
        (studentSemesterRegistration.totalCreditsTaken < semesterRegistration?.minCredit ||
            studentSemesterRegistration.totalCreditsTaken > semesterRegistration?.maxCredit)
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`)
    }

    await prisma.studentSemesterRegistration.update({
        where: {
            id: studentSemesterRegistration.id
        },
        data: {
            isConfirmed: true
        }
    })
    return {
        message: "Your registration is confirmed!"
    }

}

const getMyRegistration = async (authUserId: string) => {
    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: SemesterRegistrationStatus.ONGOING
        },
        include: {
            academicSemester: true
        }
    })

    const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration?.id
            },
            student: {
                studentId: authUserId
            }
        },
        include: {
            student: true
        }
    })

    return { semesterRegistration, studentSemesterRegistration }
}

const startNewSemester = async (
    id: string
): Promise<{
    message: string
}> => {
    const semesterRegistration = await prisma.semesterRegistration.findUnique({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });

    if (!semesterRegistration) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Semester Registration Not found!");
    }

    if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Semester Registration is not ended yet!");
    }

    if (semesterRegistration.academicSemester.isCurrent) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Semester is already started!")
    }

    await prisma.$transaction(async (prismaTransactionClient) => {
        await prismaTransactionClient.academicSemester.updateMany({
            where: {
                isCurrent: true
            },
            data: {
                isCurrent: false
            }
        });

        await prismaTransactionClient.academicSemester.update({
            where: {
                id: semesterRegistration.academicSemesterId
            },
            data: {
                isCurrent: true
            }
        });

        const studentSemesterRegistrations = await prisma.studentSemesterRegistration.findMany({
            where: {
                semesterRegistration: {
                    id
                },
                isConfirmed: true
            }
        });

        await asyncForEach(
            studentSemesterRegistrations,
            async (studentSemReg: StudentSemesterRegistration) => {
                if (studentSemReg.totalCreditsTaken) {
                    const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;

                    await StudentSemesterPaymentService.createSemesterPayment(prismaTransactionClient, {
                        studentId: studentSemReg.studentId,
                        academicSemesterId: semesterRegistration.academicSemesterId,
                        totalPaymentAmount: totalSemesterPaymentAmount
                    });
                }
                const studentSemesterRegistrationCourses =
                    await prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
                        where: {
                            semesterRegistration: {
                                id
                            },
                            student: {
                                id: studentSemReg.studentId
                            }
                        },
                        include: {
                            offeredCourse: {
                                include: {
                                    course: true
                                }
                            }
                        }
                    });
                await asyncForEach(
                    studentSemesterRegistrationCourses,
                    async (
                        item: StudentSemesterRegistrationCourse & {
                            offeredCourse: OfferedCourse & {
                                course: Course;
                            };
                        }
                    ) => {

                        const isExistEnrolledData = await prismaTransactionClient.studentEnrolledCourse.findFirst({
                            where: {
                                student: { id: item.studentId },
                                course: { id: item.offeredCourse.courseId },
                                academicSemester: { id: semesterRegistration.academicSemesterId }
                            }
                        });

                        if (!isExistEnrolledData) {
                            const enrolledCourseData = {
                                studentId: item.studentId,
                                courseId: item.offeredCourse.courseId,
                                academicSemesterId: semesterRegistration.academicSemesterId
                            }

                            const studentEnrolledCourseData = await prismaTransactionClient.studentEnrolledCourse.create({
                                data: enrolledCourseData
                            });

                            await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(prismaTransactionClient, {
                                studentId: item.studentId,
                                studentEnrolledCourseId: studentEnrolledCourseData.id,
                                academicSemesterId: semesterRegistration.academicSemesterId
                            })

                        }

                    }
                )
            }

        )
    })


    return {
        message: "Semester started successfully!"
    }
}


const getMySemesterRegCouses = async (
    authUserId: string
) => {
    const student = await prisma.student.findFirst({
        where: {
            studentId: authUserId
        }
    });

    //console.log(student);

    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [SemesterRegistrationStatus.UPCOMING, SemesterRegistrationStatus.ONGOING]
            }
        },
        include: {
            academicSemester: true
        }
    });
    console.log(semesterRegistration)

    if (!semesterRegistration) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No semester registration not found!")
    }

    const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
        where: {
            status: StudentEnrolledCourseStatus.COMPLETED,
            student: {
                id: student?.id
            }
        },
        include: {
            course: true
        }
    });

    const studentCurrentSemesterTakenCourse = await prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            student: {
                id: student?.id
            },
            semesterRegistration: {
                id: semesterRegistration?.id
            }
        },
        include: {
            offeredCourse: true,
            offeredCourseSection: true
        }
    });
    console.log(studentCurrentSemesterTakenCourse)

    const offeredCourse = await prisma.offeredCourse.findMany({
        where: {
            semesterRegistration: {
                id: semesterRegistration.id
            },
            academicDepartment: {
                id: student?.academicDepartmentId
            }
        },
        include: {
            course: {
                include: {
                    preRequisite: {
                        include: {
                            preRequisite: true
                        }
                    }
                }
            },
            offeredCourseSections: {
                include: {
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
            }
        }
    });

    //console.log("Offered course: ", offeredCourse)
    const availableCourses = SemesterRegistrationUtils.getAvailableCourses(offeredCourse, studentCompletedCourse, studentCurrentSemesterTakenCourse);
    return availableCourses;
}


export const SemesterRegistrationService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    startMyRegistration,
    enrollIntoCourse,
    withdrewFromCourse,
    confirmMyRegistration,
    getMyRegistration,
    startNewSemester,
    getMySemesterRegCouses
}