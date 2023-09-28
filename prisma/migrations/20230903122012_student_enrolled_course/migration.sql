-- CreateEnum
CREATE TYPE "StudentEnrolledCourseStatus" AS ENUM ('ONGOING', 'COMPLETED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "StudentEnrolledCourse" (
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

    CONSTRAINT "StudentEnrolledCourse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentEnrolledCourse" ADD CONSTRAINT "StudentEnrolledCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrolledCourse" ADD CONSTRAINT "StudentEnrolledCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrolledCourse" ADD CONSTRAINT "StudentEnrolledCourse_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
