export const offeredCourseClassScheduleSearchableFields = ['dayOfWeek'];

export const offeredCourseClassScheduleRelationalFields = [
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'facultyId',
    'roomId'
]

export const offeredCourseClassScheduleRelationalFieldsMapper: { [key: string]: string } = {
    offeredCourseSectionId: 'offeredCourseSection',
    facultyId: 'faculty',
    roomId: 'room',
    semesterRegistrationId: 'semesterRegistration'
}


export const offeredCourseClassScheduleFilterableFields = [
    'searchTerm',
    'dayOfWeek',
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'roomId',
    'facultyId'
]