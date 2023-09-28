import { OfferedCourse, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { asyncForEach } from "../../../shared/utils";
import { offeredCourseRelationalFields, offeredCourseRelationalFieldsMapper, offeredCourseSearchableFields } from "./offeredCourse.constants";
import { ICreateOfferedCourse, IOfferedCourseFilterRequest } from "./offeredCourse.interface";

const insertIntoDB = async (data: ICreateOfferedCourse): Promise<OfferedCourse[]> => {
    const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
    const result: OfferedCourse[] = [];

    await asyncForEach(courseIds, async (courseId: string) => {
        const alreadyExist = await prisma.offeredCourse.findFirst({
            where: {
                academicDepartmentId,
                semesterRegistrationId,
                courseId
            }
        })

        if (!alreadyExist) {
            const insertOfferedCourse = await prisma.offeredCourse.create({
                data: {
                    academicDepartmentId,
                    semesterRegistrationId,
                    courseId
                },
                include: {
                    academicDepartment: true,
                    semesterRegistration: true,
                    course: true
                }
            })

            result.push(insertOfferedCourse)
        }
    })

    return result;
}

const getAllFromDB = async (
    filters: IOfferedCourseFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseSearchableFields.map((field) => ({
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
                if (offeredCourseRelationalFields.includes(key)) {
                    return {
                        [offeredCourseRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.OfferedCourseWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.offeredCourse.findMany({
        include: {
            semesterRegistration: true,
            course: true,
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
    const total = await prisma.offeredCourse.count({
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

const getByIdFromDB = async (id: string): Promise<OfferedCourse | null> => {
    const result = await prisma.offeredCourse.findUnique({
        where: {
            id
        },
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
        }
    });
    return result;
};

const updateOneInDB = async (
    id: string,
    payload: Partial<OfferedCourse>
): Promise<OfferedCourse> => {
    const result = await prisma.offeredCourse.update({
        where: {
            id
        },
        data: payload,
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
        }
    });
    return result;
};

const deleteByIdFromDB = async (id: string): Promise<OfferedCourse> => {
    const result = await prisma.offeredCourse.delete({
        where: {
            id
        },
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
        }
    });
    return result;
};

export const offeredCourseService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
}