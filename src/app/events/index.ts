import initFacultyEvents from "../modules/faculty/faculty.events";
import initStudentEvents from "../modules/student/student.events";

const subscribeToEvents = () => {
    initStudentEvents();
    initFacultyEvents();
}

export default subscribeToEvents;