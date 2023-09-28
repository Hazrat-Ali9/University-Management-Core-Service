/*
  Warnings:

  - You are about to drop the `StudentEnrolledCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentEnrolledCourse" DROP CONSTRAINT "StudentEnrolledCourse_academicSemesterId_fkey";

-- DropForeignKey
ALTER TABLE "StudentEnrolledCourse" DROP CONSTRAINT "StudentEnrolledCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentEnrolledCourse" DROP CONSTRAINT "StudentEnrolledCourse_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_enrolled_course_marks" DROP CONSTRAINT "student_enrolled_course_marks_studentEnrolledCourseId_fkey";

-- AlterTable
ALTER TABLE "student_semester_payments" ADD COLUMN     "totalDueAmount" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "StudentEnrolledCourse";

-- CreateTable
CREATE TABLE "student_enrolled_courses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "grade" TEXT,
    "point" DOUBLE PRECISION DEFAULT 0,
    "totalMarks" INTEGER DEFAULT 0,
    "status" "StudentEnrolledCourseStatus" DEFAULT 'ONGOING',

    CONSTRAINT "student_enrolled_courses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_enrolled_courses" ADD CONSTRAINT "student_enrolled_courses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_courses" ADD CONSTRAINT "student_enrolled_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_courses" ADD CONSTRAINT "student_enrolled_courses_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_marks" ADD CONSTRAINT "student_enrolled_course_marks_studentEnrolledCourseId_fkey" FOREIGN KEY ("studentEnrolledCourseId") REFERENCES "student_enrolled_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
