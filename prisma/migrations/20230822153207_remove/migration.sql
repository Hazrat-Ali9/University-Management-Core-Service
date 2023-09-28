/*
  Warnings:

  - You are about to drop the `offered_courses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "offered_courses" DROP CONSTRAINT "offered_courses_academicDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "offered_courses" DROP CONSTRAINT "offered_courses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "offered_courses" DROP CONSTRAINT "offered_courses_semesterRegistrationId_fkey";

-- DropTable
DROP TABLE "offered_courses";
