import { AcademicFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
    EVENT_ACADEMIC_FACULTY_CREATED,
    EVENT_ACADEMIC_FACULTY_DELETED,
    EVENT_ACADEMIC_FACULTY_UPDATED,
    academicFacultySearchableFields
} from './academicFaculty.constants';
import { IAcademicFacultyFilterRequest } from './academicFaculty.interface';

const insertIntoDB = async (data: AcademicFaculty): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.create({
        data
    });

    if (result) {
        await RedisClient.publish(EVENT_ACADEMIC_FACULTY_CREATED, JSON.stringify(result));
    }


    return result;
};

const getAllFromDB = async (
    filters: IAcademicFacultyFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: academicFacultySearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions: Prisma.AcademicFacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.academicFaculty.findMany({
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
    const total = await prisma.academicFaculty.count({
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

const getByIdFromDB = async (id: string): Promise<AcademicFaculty | null> => {
    const result = await prisma.academicFaculty.findUnique({
        where: {
            id
        }
    });
    return result;
};

const updateOneInDB = async (
    id: string,
    payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.update({
        where: {
            id
        },
        data: payload
    });

    if (result) {
        await RedisClient.publish(EVENT_ACADEMIC_FACULTY_UPDATED, JSON.stringify(result));
    }
    return result;
};

const deleteByIdFromDB = async (id: string): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.delete({
        where: {
            id
        }
    });

    if (result) {
        await RedisClient.publish(EVENT_ACADEMIC_FACULTY_DELETED, JSON.stringify(result));
    }
    return result;
};


export const AcademicFacultyService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
};