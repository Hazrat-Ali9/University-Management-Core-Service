import { ExamType } from '@prisma/client';

export type IStudentEnrolledCourseMarkFilterRequest = {
    searchTerm?: string | undefined;
    academicSemesterId?: string | undefined;
    studentId?: string | undefined;
    studentEnrolledCourseId?: string | undefined;
    courseId?: string | undefined;
}

export type IUpdateStudentMarksPayload = {
    academicSemesterId: string;
    studentId: string;
    courseId: string;
    examType: ExamType;
    marks: number;
}

export type IUpdateStudentCourseFinalMarksPayload = {
    academicSemesterId: string;
    studentId: string;
    courseId: string;
}