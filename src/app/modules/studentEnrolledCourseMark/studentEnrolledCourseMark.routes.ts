import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseMarkConroller } from './studentEnrolledCourseMark.controller';
import { StudentEnrolledCourseMarkValidation } from './studentEnrolledCourseMark.validations';

const router = express.Router();

router.get(
    '/',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrolledCourseMarkConroller.getAllFromDB
);

router.get(
    '/my-marks',
    auth(ENUM_USER_ROLE.STUDENT),
    StudentEnrolledCourseMarkConroller.getMyCourseMarks
);

router.patch(
    '/update-marks',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
    validateRequest(StudentEnrolledCourseMarkValidation.updateStudentMarks),
    StudentEnrolledCourseMarkConroller.updateStudentMarks
)
router.patch(
    '/update-final-marks',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
    validateRequest(StudentEnrolledCourseMarkValidation.updateStudentMarks),
    StudentEnrolledCourseMarkConroller.updateFinalMarks
)

export const studentEnrolledCourseMarkRoutes = router;