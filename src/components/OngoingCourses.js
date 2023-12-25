import React from "react";
import CoursesAccordion from "./CoursesAccordion";

function OngoingCourses() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold font-primary">Ongoing Courses</h1>
      <CoursesAccordion />
    </div>
  );
}

export default OngoingCourses;
