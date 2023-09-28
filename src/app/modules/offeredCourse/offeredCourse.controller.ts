import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { offeredCourseFilterableFields } from "./offeredCourse.constants";
import { offeredCourseService } from "./offeredCourse.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await offeredCourseService.insertIntoDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered Course Created",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await offeredCourseService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourses fetched successfully',
        meta: result.meta,
        data: result.data
    });
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await offeredCourseService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse fetched successfully',
        data: result
    });
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await offeredCourseService.updateOneInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse updated successfully',
        data: result
    });
})

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await offeredCourseService.deleteByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourse deleted successfully',
        data: result
    });
})

export const OfferedCourseController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
}