export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["INSTRUCTOR"] = "instructor";
    UserRole["STUDENT"] = "student";
})(UserRole || (UserRole = {}));
export var SoftwareModule;
(function (SoftwareModule) {
    SoftwareModule["WORD"] = "word";
    SoftwareModule["EXCEL"] = "excel";
    SoftwareModule["POWERPOINT"] = "powerpoint";
    SoftwareModule["ACCESS"] = "access";
    SoftwareModule["OUTLOOK"] = "outlook";
    SoftwareModule["ONENOTE"] = "onenote";
    SoftwareModule["TEAMS"] = "teams";
})(SoftwareModule || (SoftwareModule = {}));
export var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "beginner";
    CourseLevel["INTERMEDIATE"] = "intermediate";
    CourseLevel["ADVANCED"] = "advanced";
    CourseLevel["EXPERT"] = "expert";
})(CourseLevel || (CourseLevel = {}));
export var ContentType;
(function (ContentType) {
    ContentType["VIDEO"] = "video";
    ContentType["PDF"] = "pdf";
    ContentType["LINK"] = "link";
    ContentType["LAB"] = "lab";
})(ContentType || (ContentType = {}));
export var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["ACTIVE"] = "active";
    EnrollmentStatus["COMPLETED"] = "completed";
    EnrollmentStatus["DROPPED"] = "dropped";
})(EnrollmentStatus || (EnrollmentStatus = {}));
export var QuizStatus;
(function (QuizStatus) {
    QuizStatus["DRAFT"] = "draft";
    QuizStatus["PUBLISHED"] = "published";
})(QuizStatus || (QuizStatus = {}));
export var AttemptStatus;
(function (AttemptStatus) {
    AttemptStatus["IN_PROGRESS"] = "in_progress";
    AttemptStatus["SUBMITTED"] = "submitted";
    AttemptStatus["GRADED"] = "graded";
})(AttemptStatus || (AttemptStatus = {}));
//# sourceMappingURL=enums.js.map