import CreateQuiz from "@/components/Forms/CreateQuiz";
import React from "react";

function EditQuiz() {
  return (
    <div className="bg-white p-8 rounded-xl">
      <CreateQuiz type="edit" />
    </div>
  );
}

export default EditQuiz;
