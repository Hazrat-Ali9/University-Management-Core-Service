import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validations';

const router = express.Router();

router.get('/', FacultyController.getAllFromDB);

router.get(
    '/my-courses',
    auth(ENUM_USER_ROLE.FACULTY),
    FacultyController.myCourses
);

router.get('/:id', FacultyController.getByIdFromDB);

router.get(
    '/my-course-students',
    auth(ENUM_USER_ROLE.FACULTY),
    FacultyController.getMyCourseStudents
);

router.post(
    '/',
    validateRequest(FacultyValidation.create),
    FacultyController.insertIntoDB
);

router.patch(
    '/:id',
    validateRequest(FacultyValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.updateOneInDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.deleteByIdFromDB
);

router.post(
    '/:id/assign-courses',
    validateRequest(FacultyValidation.assignOrRemoveCourses),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.assignCourses)

router.delete(
    '/:id/remove-courses',
    validateRequest(FacultyValidation.assignOrRemoveCourses),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.removeCourses)

export const facultyRoutes = router;