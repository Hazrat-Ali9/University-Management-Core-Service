import { ExamType, PrismaClient, StudentEnrolledCourseMark, StudentEnrolledCourseStatus } from "@prisma/client"
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library"
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import { paginationHelpers } from "../../../helpers/paginationHelper"
import { IGenericResponse } from "../../../interfaces/common"
import { IPaginationOptions } from "../../../interfaces/pagination"
import prisma from "../../../shared/prisma"
import { IStudentEnrolledCourseMarkFilterRequest } from "./studentEnrolledCourseMark.interface"
import { StudentEnrolledCourseMarkUtils } from "./studentEnrolledCousreMark.utils"

const createStudentEnrolledCourseDefaultMark = async (
    prismaClient: Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    payload: {
        studentId: string,
        studentEnrolledCourseId: string,
        academicSemesterId: string
    }
) => {
    const isExitMidtermData = await prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: ExamType.MIDTERM,
            student: {
                id: payload.studentId
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId
            },
            academicSemester: {
                id: payload.academicSemesterId
            }
        }
    })
    if (!isExitMidtermData) {
        await prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId
                    }
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId
                    }
                },
                academicSemester: {
                    connect: {
                        id: payload.academicSemesterId
                    }
                },
                examType: ExamType.MIDTERM
            }
        })
    }

    const isExistFinalData = await prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: ExamType.FINAL,
            student: {
                id: payload.studentId
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId
            },
            academicSemester: {
                id: payload.academicSemesterId
            }
        }
    })

    if (!isExistFinalData) {
        await prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId
                    }
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId
                    }
                },
                academicSemester: {
                    connect: {
                        id: payload.academicSemesterId
                    }
                },
                examType: ExamType.FINAL
            }
        })
    }
}

const getAllFromDB = async (
    filters: IStudentEnrolledCourseMarkFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
    const { limit, page } = paginationHelpers.calculatePagination(options);

    const marks = await prisma.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: filters.studentId
            },
            academicSemester: {
                id: filters.academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: filters.courseId
                }
            }
        },
        include: {
            studentEnrolledCourse: {
                include: {
                    course: true
                }
            },
            student: true
        }
    });

    return {
        meta: {
            total: marks.length,
            page,
            limit
        },
        data: marks
    };
};

const updateStudentMarks = async (payload: any) => {
    console.log(payload)
    const { studentId, academicSemesterId, courseId, examType, marks } = payload;

    const studentEnrolledCourseMarks = await prisma.studentEnrolledCourseMark.findFirst({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: courseId
                }
            },
            examType
        }
    })

    if (!studentEnrolledCourseMarks) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Student enrolled course mark not found!")
    }
    const result = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks)

    const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
        where: {
            id: studentEnrolledCourseMarks.id
        },
        data: {
            marks,
            grade: result.grade
        }
    })

    return updateStudentMarks;
}

const updateFinalMarks = async (payload: any) => {
    const { studentId, academicSemesterId, courseId } = payload;
    const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            course: {
                id: courseId
            }
        }
    });

    if (!studentEnrolledCourse) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Student enrolled course data not found!")
    }

    //console.log(studentEnrolledCourse)
    const studentEnrolledCourseMarks = await prisma.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: courseId
                }
            }
        }
    });

    //console.log(studentEnrolledCourseMarks)
    if (!studentEnrolledCourseMarks.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, "student enrolled course mark not found!")
    }

    const midTermMarks = studentEnrolledCourseMarks.find((item) => item.examType === ExamType.MIDTERM)?.marks || 0;
    const finalTermMarks = studentEnrolledCourseMarks.find((item) => item.examType === ExamType.FINAL)?.marks || 0;
    //console.log(midTermMarks, finalTermMarks)

    const totalFinalMarks = Math.ceil(midTermMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);
    const result = StudentEnrolledCourseMarkUtils.getGradeFromMarks(totalFinalMarks)


    await prisma.studentEnrolledCourse.updateMany({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            course: {
                id: courseId
            }
        },
        data: {
            grade: result.grade,
            point: result.point,
            totalMarks: totalFinalMarks,
            status: StudentEnrolledCourseStatus.COMPLETED
        }
    });

    const grades = await prisma.studentEnrolledCourse.findMany({
        where: {
            student: {
                id: studentId
            },
            status: StudentEnrolledCourseStatus.COMPLETED
        },
        include: {
            course: true
        }
    });

    const academicResult = await StudentEnrolledCourseMarkUtils.calcCGPAandGrade(grades);

    const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
        where: {
            student: {
                id: studentId
            }
        }
    })

    if (studentAcademicInfo) {
        await prisma.studentAcademicInfo.update({
            where: {
                id: studentAcademicInfo.id
            },
            data: {
                totalCompletedCredit: academicResult.totalCompletedCredit,
                cgpa: academicResult.cgpa
            }
        })
    }
    else {
        await prisma.studentAcademicInfo.create({
            data: {
                student: {
                    connect: {
                        id: studentId
                    }
                },
                totalCompletedCredit: academicResult.totalCompletedCredit,
                cgpa: academicResult.cgpa
            }
        })
    }

    return grades;
};

const getMyCourseMarks = async (
    filters: IStudentEnrolledCourseMarkFilterRequest,
    options: IPaginationOptions,
    authUser: any
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
    const { limit, page, } = paginationHelpers.calculatePagination(options);

    const student = await prisma.student.findFirst({
        where: {
            studentId: authUser.id
        }
    });

    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
    }

    const marks = await prisma.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: student.id
            },
            academicSemester: {
                id: filters.academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: filters.courseId
                }
            }
        },
        include: {
            studentEnrolledCourse: {
                include: {
                    course: true
                }
            }
        }
    });

    return {
        meta: {
            total: marks.length,
            page,
            limit
        },
        data: marks
    };
};

export const StudentEnrolledCourseMarkService = {
    createStudentEnrolledCourseDefaultMark,
    getAllFromDB,
    updateStudentMarks,
    updateFinalMarks,
    getMyCourseMarks
}