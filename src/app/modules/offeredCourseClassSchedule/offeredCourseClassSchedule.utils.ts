import { OfferedCourseClassSchedule } from "@prisma/client"
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import prisma from "../../../shared/prisma"
import { hasTimeConflict } from "../../../shared/utils"

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
    const alreadyBookedRoomOnDay = await prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            room: {
                id: data.roomId
            }
        }
    })

    const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek
    }))


    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek
    }

    if (hasTimeConflict(existingSlots, newSlot)) {
        throw new ApiError(httpStatus.CONFLICT, "Room is already booked!")
    }
}

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
    const alreadyFcultyAssigned = await prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            faculty: {
                id: data.facultyId
            }
        }
    })

    const existingSlots = alreadyFcultyAssigned.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek
    }))


    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek
    }

    if (hasTimeConflict(existingSlots, newSlot)) {
        throw new ApiError(httpStatus.CONFLICT, "Faculty is already booked!")
    }
}

export const OfferedCourseClassScheduleUtils = {
    checkRoomAvailable,
    checkFacultyAvailable
}