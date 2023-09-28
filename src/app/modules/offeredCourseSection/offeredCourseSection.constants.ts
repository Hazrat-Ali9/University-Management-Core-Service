export const offeredCourseSectionFilterableFields: string[] = [
    'searchTerm',
    'id',
    'offeredCourseId',
    'semesterRegistrationId'
];

export const offeredCourseSectionSearchableFields: string[] = [];

export const offeredCourseSectionRelationalFields: string[] = [
    'offeredCourseId',
    'semesterRegistrationId'
];
export const offeredCourseSectionRelationalFieldsMapper: { [key: string]: string } = {
    offeredCourseId: 'offeredCourse',
    semesterRegistrationId: 'semesterRegistration'
};

export const daysInWeek = [
    'SATURDAY',
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY'
];