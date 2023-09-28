import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import { StudentEnrolledCourseValidation } from './studentEnrolledCourse.validations';

const router = express.Router();

router.get('/', StudentEnrolledCourseController.getAllFromDB);

router.get('/:id', StudentEnrolledCourseController.getByIdFromDB);

router.post(
    '/',
    validateRequest(StudentEnrolledCourseValidation.create),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    StudentEnrolledCourseController.insertIntoDB
);

router.patch(
    '/:id',
    validateRequest(StudentEnrolledCourseValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    StudentEnrolledCourseController.updateOneInDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    StudentEnrolledCourseController.deleteByIdFromDB
);

export const studentEnrolledCourseRoutes = router;