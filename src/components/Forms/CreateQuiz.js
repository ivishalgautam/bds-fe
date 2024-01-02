import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Title from "../Title";
import { MdOutlineAdd } from "react-icons/md";
import Delete from "../../assets/Delete.svg";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFetchCoursesNames } from "@/hooks/useFetchCoursesName";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRef } from "react";
import { isObject } from "@/utils/object";

function CreateQuiz({ type }) {
  const router = useRouter();
  const { id: selectedCourse } = router.query;
  const { data: courseOptions } = useFetchCoursesNames();
  const menuPortalTargetRef = useRef(null);

  const [weekOption, setWeekOption] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      quiz_name: "",
      course_id: null,
      weeks: null,
      quizs: [
        { ques_no: 1, question: "", options: ["", "", "", ""], answer: "" },
      ],
    },
  });
  const { fields, update, append, remove } = useFieldArray({
    control,
    name: "quizs",
  });

  const addQuestion = () => {
    append({
      ques_no: fields.length + 1,
      question: "",
      options: ["", "", "", ""],
      answer: "",
    });
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      course_id: data.course_id.value,
      weeks: data.weeks.value,
    };
    console.log(payload);
    if (type === "add") {
      handleCreate(payload);
    } else {
      handleUpdate(payload);
    }
    reset();
  };

  // fetch and bind selected quiz
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.quiz.getAll}/${selectedCourse}`
        );

        const course = {
          value: data.course_id,
          label: data.course_name,
        };
        setValue("course_id", course);
        setValue("weeks", {
          value: data.weeks,
          label: `Week ${data.weeks}`,
        });
        setValue("quiz_name", data.quiz_name);
        // Populate the quiz fields
        data.questions.forEach((item, index) => {
          const options = item.options.map((option) => option);
          update(index, {
            ques_no: item.ques_no,
            question: item.question,
            options: options,
            answer: item.answer,
          });
        });
      } catch (error) {
        console.error(error);
      }
    };
    if ((type === "edit" || type === "view") && selectedCourse) {
      fetchData();
    }
  }, [selectedCourse]);

  const watchCourseId = watch("course_id");
  useEffect(() => {
    if (watchCourseId) {
      const course = courseOptions?.find(
        (c) => c.value === watchCourseId.value
      );
      if (course?.course_syllabus == null) return;
      const weeks = course.course_syllabus.map(({ weeks }) => {
        return {
          value: weeks,
          label: `Week ${weeks}`,
        };
      });
      setWeekOption(weeks);
    }
  }, [watchCourseId, setWeekOption]);

  const handleCourseChange = (event) => {
    setValue("weeks", null);
  };

  const queryClient = useQueryClient();
  const createQuiz = async (newItem) => {
    await http().post(endpoints.quiz.getAll, newItem);
  };

  const createMutation = useMutation(createQuiz, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
      toast.success("Quiz created successfully.");
    },
    onError: (e) => {
      if (isObject) {
        return toast.error(e.message);
      }
      toast.error("Failed to create Quiz");
    },
  });
  const handleCreate = (newItem) => {
    createMutation.mutate(newItem);
    router.push("/quiz");
  };

  const updateItem = async (itemId, updatedItem) => {
    await http().put(`${endpoints.quiz.getAll}/${itemId}`, updatedItem);
  };

  const updateMutation = useMutation(
    (updatedItem) => updateItem(selectedCourse, updatedItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["quiz"] });
        toast.success("Quiz updated successfully.");
      },
      onError: () => {
        toast.error("Failed to updated Quiz.");
      },
    }
  );

  const handleUpdate = (updatedItem) => {
    updateMutation.mutate(updatedItem);
    router.push("/quiz");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Title
        text={
          type === "add"
            ? "Create Quiz"
            : type === "view"
            ? "Quiz Details"
            : "Edit Quiz"
        }
      />
      <div>
        {type === "view" && <label htmlFor="quizName">Quiz Name</label>}
        <input
          type="text"
          id="quizName"
          className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          disabled={type === "view"}
          placeholder="Quiz name"
          {...register("quiz_name", { required: true })}
        />
        {errors.quiz_name && (
          <span className="text-red-600">This field is required</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="">
          {type === "view" && <label htmlFor="courseId">Course</label>}
          <Controller
            control={control}
            name="course_id"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Course Name"
                options={courseOptions}
                isDisabled={type === "view"}
                onInputChange={handleCourseChange}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={menuPortalTargetRef.current}
                menuPosition="absolute"
                className="w-full border outline-none rounded-md font-mulish text-xl font-semibold"
              />
            )}
          />
          {errors.course_id && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="">
          {type === "view" && <label htmlFor="weeks">Weeks</label>}
          <Controller
            control={control}
            name="weeks"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Week"
                options={weekOption}
                isDisabled={type === "view"}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={menuPortalTargetRef.current}
                menuPosition="absolute"
                className="w-full border outline-none rounded-md font-mulish text-xl font-semibold"
              />
            )}
          />
          {errors.weeks && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>
      </div>
      {fields.map((question, index) => (
        <div key={question.id} className="space-y-4">
          <div className="flex justify-between">
            <h3>Question {index + 1}</h3>
            {type !== "view" && index !== 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="px-4 py-2 border-2 right-0 border-red-500 rounded-full font-mulish text-red-500 max-w-max"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>

          <input
            type="text"
            className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            disabled={type === "view"}
            id={`question-${index}`}
            placeholder={`Question No :- ${index + 1}`}
            {...register(`quizs[${index}].question`, { required: true })}
          />
          {errors.quizs && errors.quizs[index]?.question && (
            <span className="text-red-600">This field is required</span>
          )}
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                {type === "view" && (
                  <label htmlFor={`option-${index}-${optionIndex}`}>
                    {" "}
                    Option {optionIndex + 1}{" "}
                  </label>
                )}
                <input
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  disabled={type === "view"}
                  id={`option-${index}-${optionIndex}`}
                  {...register(`quizs[${index}].options[${optionIndex}]`, {
                    required: true,
                  })}
                />
                {errors.quizs &&
                  errors.quizs[index]?.options &&
                  errors.quizs[index]?.options[optionIndex] && (
                    <span className="text-red-600">This field is required</span>
                  )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {type !== "view" && (
              <label htmlFor={`answer-${index}`}>Answer:</label>
            )}
            <input
              type="text"
              id={`answer-${index}`}
              placeholder="Answer"
              className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              disabled={type === "view"}
              {...register(`quizs[${index}].answer`, { required: true })}
            />
            {errors.quizs && errors.quizs[index]?.answer && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
        </div>
      ))}

      {type !== "view" && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 border-2 border-primary rounded-full font-mulish text-primary max-w-max"
          >
            Add More Question
          </button>
        </div>
      )}
      {type !== "view" && (
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary px-6 py-2 text-white rounded-full"
          >
            Submit
          </button>
        </div>
      )}
    </form>
  );
}

export default CreateQuiz;
