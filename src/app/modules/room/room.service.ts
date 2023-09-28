import { Prisma, Room } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
    roomRelationalFields,
    roomRelationalFieldsMapper,
    roomSearchableFields
} from './room.constants';
import { IRoomFilterRequest } from './room.interface';


const insertIntoDB = async (data: Room): Promise<Room> => {
    const result = await prisma.room.create({
        data,
        include: {
            building: true
        }
    });
    return result;
};

const getAllFromDB = async (
    filters: IRoomFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: roomSearchableFields.map((field) => ({
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
                if (roomRelationalFields.includes(key)) {
                    return {
                        [roomRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.RoomWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.room.findMany({
        include: {
            building: true
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
    const total = await prisma.room.count({
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

const getByIdFromDB = async (id: string): Promise<Room | null> => {
    const result = await prisma.room.findUnique({
        where: {
            id
        },
        include: {
            building: true
        }
    });
    return result;
};

const updateOneInDB = async (id: string, payload: Partial<Room>): Promise<Room> => {
    const result = await prisma.room.update({
        where: {
            id
        },
        data: payload,
        include: {
            building: true
        }
    });
    return result;
};

const deleteByIdFromDB = async (id: string): Promise<Room> => {
    const result = await prisma.room.delete({
        where: {
            id
        },
        include: {
            building: true
        }
    });
    return result;
};

export const RoomService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
};