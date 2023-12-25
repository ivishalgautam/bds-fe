import React from "react";
import CreateCourse from "../../components/Forms/CreateCourse";
import { useRouter } from "next/router";

function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;
  return <CreateCourse id={id} type="view" />;
}

export default CourseDetails;
