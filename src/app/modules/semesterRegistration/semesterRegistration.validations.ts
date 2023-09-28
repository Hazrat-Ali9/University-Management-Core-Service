import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
    body: z.object({
        startDate: z.string({
            required_error: 'Start date is required'
        }),
        endDate: z.string({
            required_error: 'End date is required'
        }),
        academicSemesterId: z.string({
            required_error: 'Academic semester id is required'
        }),
        minCredit: z.number({
            required_error: 'Min credit is required'
        }),
        maxCredit: z.number({
            required_error: 'Max credit is required'
        })
    })
});

const update = z.object({
    body: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        academicSemesterId: z.string().optional(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
        status: z.enum([...Object.values(SemesterRegistrationStatus)] as [string, ...string[]], {}).optional()
    })
});

const enrollOrWithdrawCourse = z.object({
    body: z.object({
        offeredCourseId: z.string({
            required_error: "Offered course id is required"
        }),
        offeredCourseSectionId: z.string({
            required_error: "Offered course Section id is required"
        })
    })
})
export const SemesterRegistrationValidation = {
    create,
    update,
    enrollOrWithdrawCourse
};