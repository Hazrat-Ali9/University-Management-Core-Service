-- CreateTable
CREATE TABLE "course_faculties" (
    "courseId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "course_faculties_pkey" PRIMARY KEY ("courseId","facultyId")
);

-- AddForeignKey
ALTER TABLE "course_faculties" ADD CONSTRAINT "course_faculties_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_faculties" ADD CONSTRAINT "course_faculties_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
