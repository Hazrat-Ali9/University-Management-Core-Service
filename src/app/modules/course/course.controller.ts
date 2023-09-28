import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { courseFilterableFields } from "./course.constants";
import { CourseService } from "./course.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    //console.log(req.body)
    const result = await CourseService.insertIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course created successufully",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, courseFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await CourseService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Courses fetched successfully',
        meta: result.meta,
        data: result.data
    });
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course fetched successfully',
        data: result
    });
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseService.updateOneInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course updated successfully',
        data: result
    });
})

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseService.deleteByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course deleted successfully',
        data: result
    });
})


const assignFaculies = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(req.body.faculties)
    const result = await CourseService.assignFaculies(id, req.body.faculties);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course faculty assigned successfully',
        data: result
    });
})

const removeFaculties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(req.body.faculties)
    const result = await CourseService.removeFaculties(id, req.body.faculties);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course faculty deleted successfully',
        data: result
    });
})

export const CourseController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteByIdFromDB,
    updateOneInDB,
    assignFaculies,
    removeFaculties
}