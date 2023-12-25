import ResultCard from "@/components/Cards/ResultCard";
import DocViewerApp from "@/components/DocViewerApp";
import Modal from "@/components/Modal";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import useLocalStorage from "@/utils/useLocalStorage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

const fetchHomeworks = async () => {
  return await http().get(endpoints.homeworks.myHomeworks);
};
const fetchBatches = async () => {
  return await http().get(endpoints.batch.getAll);
};
export default function StudentHomeworks() {
  const [homeworks, setHomeworks] = useState(null);
  const [inCompleteHomeworks, setInCompleteHomeworks] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [weeks, setWeeks] = useState(null);
  const [days, setDays] = useState(null);
  const [batchStudents, setBatchStudents] = useState(null);
  const [selected, setSelected] = useState({
    selectedBatches: null,
    selectedWeek: null,
    selectedDay: null,
  });
  const [docs, setDocs] = useState([{}]);
  const [openDocViewer, setOpenDocViewer] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const { data } = useQuery({
    queryFn: fetchHomeworks,
    queryKey: ["fetchStudentsHomeworks"],
    enabled:
      !!selected.selectedBatches &&
      !!selected.selectedWeek &&
      !!selected.selectedDay,
  });

  const { data: batches } = useQuery({
    queryFn: fetchBatches,
    queryKey: ["fetchBatches"],
  });

  // console.log({ batches });

  const formattedBatches = batches?.map(
    ({ id: value, batch_name: label, course_name }) => ({
      value,
      label,
      course_name,
    })
  );

  function handleSelectChange(e) {
    const { name, value } = e.target;
    setSelected((prev) => ({
      ...prev,
      [name]: name !== "selectedBatches" ? parseInt(value) : value,
    }));
  }

  useEffect(() => {
    setSyllabus(
      batches?.filter((btc) => btc.id === selected.selectedBatches)[0]
        ?.course_syllabus
    );
  }, [selected.selectedBatches]);

  useEffect(() => {
    setWeeks(
      syllabus?.map(({ weeks }) => ({ label: `Week ${weeks}`, value: weeks }))
    );
  }, [syllabus]);

  useEffect(() => {
    if (selected.selectedWeek !== null) {
      const filteredDays = syllabus
        ?.filter((s) => s.weeks === parseInt(selected.selectedWeek))[0]
        ?.day_wise.map(({ days }) => ({ label: `Day ${days}`, value: days }));
      setDays(filteredDays);
    }
  }, [selected.selectedWeek]);

  useEffect(() => {
    if (Object.values(selected).every((d) => d !== null)) {
      setHomeworks(
        data?.filter(
          (h) =>
            h.batch_id === selected.selectedBatches &&
            h.week === selected.selectedWeek &&
            h.day === selected.selectedDay
        )
      );
    }
  }, [selected, data]);

  useEffect(() => {
    if (Object.values(selected).every((d) => d !== null)) {
      const studentsWithHomeworks = homeworks?.map((h) => h.student_id);
      setInCompleteHomeworks(
        batchStudents?.filter(
          (h) => !studentsWithHomeworks?.includes(h.student_id)
        )
      );
    }
  }, [homeworks, batchStudents]);

  // console.log({ incomplete: inCompleteHomeworks });

  useEffect(() => {
    async function fetchBatchStudents(batchId) {
      const resp = await axios.get(
        `${baseUrl}${endpoints.batch.getAll}/${batchId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log({ data: resp.data });
      setBatchStudents(resp.data);
    }
    if (selected.selectedBatches !== null) {
      fetchBatchStudents(selected.selectedBatches);
    }
  }, [selected.selectedBatches]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <select
          name="selectedBatches"
          defaultValue={""}
          onChange={(e) => handleSelectChange(e)}
          className="select-input"
        >
          <option hidden value="">
            Select batch
          </option>
          {formattedBatches?.map(({ value, course_name }) => (
            <optgroup key={value} label={`Batches of: ${course_name}`}>
              {formattedBatches
                ?.filter((c) => c.value === value)
                ?.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {weeks ? (
          <select
            defaultValue={""}
            name="selectedWeek"
            onChange={(e) => handleSelectChange(e)}
            className="select-input"
          >
            <option hidden value="">
              Select week
            </option>
            {weeks?.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : null}
        {days ? (
          <select
            defaultValue={""}
            name="selectedDay"
            onChange={(e) => handleSelectChange(e)}
            className="select-input"
          >
            <option hidden value="">
              Select day
            </option>
            {days?.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {/* completed */}
      {homeworks?.length > 0 && (
        <div>
          <Title text={"Completed homeworks"} />
          <div className="grid grid-cols-3 mt-4 gap-4">
            {homeworks !== null ? (
              homeworks?.map((homework) => (
                <ResultCard
                  key={homework.id}
                  image={homework.student_image}
                  studentName={homework.student_name}
                  file={homework?.file}
                  setDocs={setDocs}
                  setOpenDocViewer={setOpenDocViewer}
                  studentId={homework.student_id}
                  batchStudents={batchStudents}
                  completed={true}
                />
              ))
            ) : (
              <p>No one completed homework!</p>
            )}
          </div>
        </div>
      )}

      {/* incomplete */}
      {inCompleteHomeworks !== null && inCompleteHomeworks?.length > 0 && (
        <div>
          <Title text={"Incompleted homeworks"} />
          <div className="grid grid-cols-3 mt-4 gap-4">
            {inCompleteHomeworks?.map((homework, key) => (
              <ResultCard
                key={homework?.id || key}
                image={homework?.student_image}
                studentName={homework?.student_name}
                file={homework?.file}
                setDocs={setDocs}
                setOpenDocViewer={setOpenDocViewer}
                studentId={homework?.student_id}
                batchStudents={batchStudents}
                completed={false}
              />
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={openDocViewer} onClose={() => setOpenDocViewer(false)}>
        <DocViewerApp docs={docs} />
      </Modal>
    </div>
  );
}
