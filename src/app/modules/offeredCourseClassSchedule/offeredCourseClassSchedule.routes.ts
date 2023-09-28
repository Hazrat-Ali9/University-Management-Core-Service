import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validations';

const router = express.Router();

router.get('/', OfferedCourseClassScheduleController.getAllFromDB);
router.get('/:id', OfferedCourseClassScheduleController.getByIdFromDB);

router.post(
    '/',
    validateRequest(OfferedCourseClassScheduleValidation.create),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseClassScheduleController.insertIntoDB
);

router.patch(
    '/:id',
    validateRequest(OfferedCourseClassScheduleValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseClassScheduleController.updateOneInDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseClassScheduleController.deleteByIdFromDB
);



export const offeredCourseClassScheduleRoutes = router;