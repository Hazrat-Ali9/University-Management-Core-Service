import { AcademicSemester } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemesterService } from "./academicSemester.service";
import { AcademicSemesterFilterAbleFileds } from "./academicSemeter.contants";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await AcademicSemesterService.insertIntoDB(req.body);
    sendResponse<AcademicSemester>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semster Created!!",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, AcademicSemesterFilterAbleFileds);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AcademicSemesterService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semster data fetched!!",
        meta: result.meta,
        data: result.data
    })
})

const getDataById = catchAsync(async (req: Request, res: Response) => {
    const result = await AcademicSemesterService.getDataById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semster data fetched!!",
        data: result
    })
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicSemesterService.updateOneInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semster updated successfully',
        data: result
    });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicSemesterService.deleteByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semster delete successfully',
        data: result
    });
});

export const AcademicSemeterController = {
    insertIntoDB,
    getAllFromDB,
    getDataById,
    updateOneInDB,
    deleteByIdFromDB
}