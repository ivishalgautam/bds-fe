import CreateQuiz from "@/components/Forms/CreateQuiz";
import React from "react";

function CreateQuizPage() {
  return (
    <div className="bg-white p-8 rounded-xl">
      <CreateQuiz type="add" />
    </div>
  );
}

export default CreateQuizPage;
