## Home Task:

### Task 1: Student Enrolled Course Marks
- Module: Student Enrolled Course Marks
- Access: Student

- Description:
You are a student and need to retrieve your course marks for a specific academic semester and course. Use the following route to access your course marks:

- Route: {{URL}}/student-enrolled-course-marks/my-marks?academicSemesterId=04d1cc79-54b2-4deb-94ce-76c157888c6e&courseId=5e986d5f-be94-413f-b43a-a59507837866

Instructions:

- Make a GET request to the provided route.
- Include your authentication or login credentials if required.
- Retrieve and display your course marks for the specified academic semester and course.
- If there are any errors or issues, handle them gracefully and provide appropriate feedback.


### Task 2: My Course Students
- Module: Faculty
- Access: Faculty

- Description:
You are a faculty member and need to retrieve a list of students enrolled in your course for a specific academic semester and course section. Use the following route to access this information:

- Route: {{URL}}/faculties/my-course-students?academicSemesterId=04d1cc79-54b2-4deb-94ce-76c157888c6e&courseId=2257e9e6-6f4f-42a8-b463-62b90fac80e8&offeredCourseSectionId=3a95fd93-d9b0-43a2-9f36-5358a7863919&limit=10&page=1

Instructions:

- Make a GET request to the provided route.
- Include your authentication or login credentials if required.
- Retrieve and display a list of students enrolled in your course for the specified academic semester and course section.
- Paginate the results as specified by the "limit" and "page" parameters.
- If there are any errors or issues, handle them gracefully and provide appropriate feedback.

