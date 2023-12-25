import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFetchQuiz } from "@/hooks/useFetchQuiz";

const postResult = async ({
  batch_id,
  course_id,
  sub_franchisee_id,
  teacher_id,
  attemted_questions,
  total_questions,
  your_points,
  total_points,
  wrong_answers,
  not_attempted,
}) => {
  try {
    const resp = await http().post(`${endpoints.results.getAll}`, {
      batch_id,
      course_id,
      sub_franchisee_id,
      teacher_id,
      attemted_questions,
      total_questions,
      your_points,
      total_points,
      wrong_answers,
      not_attempted,
    });
    console.log(resp.data);
  } catch (error) {
    console.log(error);
  }
};

const Quiz = () => {
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState([]);
  const [check, setCheck] = useState(undefined);
  const [trace, setTrace] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [batchDetails, setBatchDetails] = useState(null);
  const router = useRouter();
  const { id, w: week } = router.query;

  const queryClient = useQueryClient();
  const { data } = useFetchQuiz(id);

  const { mutate } = useMutation(postResult, {
    onSuccess: () => {
      toast.success("Quiz submitted.");
      queryClient.invalidateQueries(["fetchResults", "rewards"]);
    },
    onError: (err) => {
      toast.error("Error while submitting");
    },
  });

  useEffect(() => {
    setResult(result.fill(check, trace, trace + 1));
  }, [trace, check, result]);

  const onSelect = (i) => {
    setCheck(i);
  };

  const onNext = () => {
    if (result.length === quiz?.questions.length) {
      return;
    }

    if (trace < quiz?.questions.length - 1) {
      setTrace((prev) => prev + 1);

      if (result.length <= trace) {
        setResult((prev) => [...prev, check]);
      }

      setCheck(undefined);
    } else {
      setResult((prev) => [...prev, check]);
    }
  };

  const onPrev = () => {
    if (trace > 0) {
      setTrace((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (data && week) {
      setQuiz(data?.quiz?.filter((i) => i.weeks === parseInt(week))?.[0]);
      setBatchDetails(data);
    }
  }, [data]);

  useEffect(() => {
    setAnswers(
      quiz?.questions.map(({ answer }) => answer.trim().toLowerCase())
    );
  }, [quiz]);

  async function handleSubmitResult() {
    if (result.length) {
      let your_points = 0;
      let wrong_answers = 0;
      // let attemted_questions = 0;
      answers?.forEach((ans, ind) => {
        if (ans === result[ind]) {
          your_points++;
        } else {
          wrong_answers++;
        }
      });

      mutate({
        batch_id: batchDetails.id,
        course_id: batchDetails.course_id,
        sub_franchisee_id: batchDetails.sub_franchisee_id,
        teacher_id: batchDetails.teacher_id,
        total_questions: quiz?.questions.length,
        your_points: your_points,
        total_points: quiz?.questions.length,
        wrong_answers: wrong_answers,
        attemted_questions: result.filter((r) => r !== undefined).length,
        not_attempted: result.filter((r) => r === undefined).length,
      });
      router.replace("/results");
    }
  }
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="bg-white rounded-lg shadow-md w-2/4 p-10">
        <h2 className="capitalize text-4xl font-bold mb-8 text-center">
          {quiz?.quiz_name}
        </h2>

        <div className="my-8">
          <h3 className="text-xl font-semibold mb-4">
            {`Question ${quiz?.questions?.[trace].ques_no}: ${quiz?.questions?.[trace].question}`}
          </h3>
          <ul className="space-y-2">
            {quiz?.questions?.[trace].options.map((o, i) => (
              <li key={i} className="flex items-center">
                <input
                  type="radio"
                  checked={result[trace] === i ? true : false}
                  value={o}
                  id={`q${i}-option`}
                  name="options"
                  onChange={(e) =>
                    onSelect(e.target.value.trim().toLowerCase())
                  }
                  className="hidden"
                />
                <label
                  htmlFor={`q${i}-option`}
                  className="flex items-center cursor-pointer"
                >
                  <div className="w-6 h-6 border border-gray-400 rounded-full mr-2 transition duration-300 ease-in-out flex items-center justify-center">
                    {result[trace] === o.trim().toLowerCase() ||
                      (check === o.trim().toLowerCase() && (
                        <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                      ))}
                  </div>
                  {o}
                </label>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-6">
            <button
              className="bg-primary border-none outline-none px-4 py-0.5 rounded-md text-white"
              onClick={() => onPrev()}
            >
              Prev
            </button>
            {result.length === quiz?.questions.length ? (
              <button
                type="button"
                onClick={handleSubmitResult}
                className="bg-emerald-500 border-none outline-none px-4 py-0.5 rounded-md text-white"
              >
                Submit
              </button>
            ) : (
              <button
                className="bg-primary border-none outline-none px-4 py-0.5 rounded-md text-white"
                onClick={() => onNext()}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
