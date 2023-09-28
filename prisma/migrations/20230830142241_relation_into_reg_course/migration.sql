-- AddForeignKey
ALTER TABLE "student_semester_registration_courses" ADD CONSTRAINT "student_semester_registration_courses_semesterRegistration_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration_courses" ADD CONSTRAINT "student_semester_registration_courses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration_courses" ADD CONSTRAINT "student_semester_registration_courses_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES "offered_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration_courses" ADD CONSTRAINT "student_semester_registration_courses_offeredCourseSection_fkey" FOREIGN KEY ("offeredCourseSectionId") REFERENCES "offered_course_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
