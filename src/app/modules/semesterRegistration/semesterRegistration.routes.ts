import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validations';

const router = express.Router();
router.get(
    '/get-my-registration',
    auth(ENUM_USER_ROLE.STUDENT),
    SemesterRegistrationController.getMyRegistration
)

router.get('/', SemesterRegistrationController.getAllFromDB);
router.get(
    '/get-my-semsester-courses',
    auth(ENUM_USER_ROLE.STUDENT),
    SemesterRegistrationController.getMySemesterRegCouses
);
router.get('/:id', SemesterRegistrationController.getByIdFromDB);


router.post(
    '/enroll-into-course',
    validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
    auth(ENUM_USER_ROLE.STUDENT),
    SemesterRegistrationController.enrollIntoCourse
)
router.post(
    '/start-registration',
    auth(ENUM_USER_ROLE.STUDENT),
    SemesterRegistrationController.startMyRegistration
)

router.post(
    '/',
    validateRequest(SemesterRegistrationValidation.create),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    SemesterRegistrationController.insertIntoDB
);

router.patch(
    '/:id',
    validateRequest(SemesterRegistrationValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    SemesterRegistrationController.updateOneInDB
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    SemesterRegistrationController.deleteByIdFromDB
);



router.post(
    '/withdraw-from-course',
    validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
    auth(ENUM_USER_ROLE.STUDENT),
    SemesterRegistrationController.withdrawFromCourse
)
router.post(
    '/confirm-my-registration',
    auth(ENUM_USER_ROLE.STUDENT),
    SemesterRegistrationController.confirmMyRegistration
)

router.post(
    '/:id/start-new-semester',
    auth(ENUM_USER_ROLE.ADMIN),
    SemesterRegistrationController.startNewSemester
)


export const semesterRegistrationRoutes = router;