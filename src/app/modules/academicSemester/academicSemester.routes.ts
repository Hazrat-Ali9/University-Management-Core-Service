import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemeterController } from './academicSemster.controller';
import { AcademicSemesterValidation } from './academicSemster.validation';
const router = express.Router();

router.get('/', AcademicSemeterController.getAllFromDB)
router.get('/:id', AcademicSemeterController.getDataById)
router.post(
    '/',
    validateRequest(AcademicSemesterValidation.create),
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    AcademicSemeterController.insertIntoDB
);

router.patch(
    '/:id',
    validateRequest(AcademicSemesterValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicSemeterController.updateOneInDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicSemeterController.deleteByIdFromDB
);

export const AcademicSemeterRoutes = router;