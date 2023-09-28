import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.contoller';
import { AcademicFacultyValidation } from './academicFaculty.validation';


const router = express.Router();

router.get('/', AcademicFacultyController.getAllFromDB);
router.get('/:id', AcademicFacultyController.getByIdFromDB);

router.post(
    '/',
    validateRequest(AcademicFacultyValidation.create),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicFacultyController.insertIntoDB
);

router.patch(
    '/:id',
    validateRequest(AcademicFacultyValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicFacultyController.updateOneInDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicFacultyController.deleteByIdFromDB
);

export const academicFacultyRoutes = router;