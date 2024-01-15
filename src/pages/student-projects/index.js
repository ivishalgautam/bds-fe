import ResultCard from "@/components/Cards/ResultCard";
import DocViewerApp from "@/components/DocViewerApp";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import useLocalStorage from "@/utils/useLocalStorage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

const fetchProjects = async () => {
  return await http().get(endpoints.projects.myProjects);
};
const fetchBatches = async () => {
  return await http().get(endpoints.batch.getAll);
};
export default function StudentProjects() {
  const [projects, setProjects] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [weeks, setWeeks] = useState(null);
  const [inCompleteProjects, setInCompleteProjects] = useState(null);
  const [batchStudents, setBatchStudents] = useState(null);
  const [docs, setDocs] = useState([{}]);
  const [openDocViewer, setOpenDocViewer] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");

  const [selected, setSelected] = useState({
    selectedBatches: null,
    selectedWeek: null,
  });

  const { data, isLoading } = useQuery({
    queryFn: fetchProjects,
    queryKey: ["fetchStudentsProjects"],
    enabled: !!selected.selectedBatches && !!selected.selectedWeek,
  });

  const { data: batches } = useQuery({
    queryFn: fetchBatches,
    queryKey: ["fetchBatches"],
  });

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
    if (Object.values(selected).every((d) => d !== null)) {
      setProjects(
        data?.filter(
          (h) =>
            h.batch_id === selected.selectedBatches &&
            h.week === selected.selectedWeek
        )
      );
    }
  }, [selected, data]);

  useEffect(() => {
    if (Object.values(selected).every((d) => d !== null)) {
      const studentsWithProjects = projects?.map((h) => h.student_id);
      setInCompleteProjects(
        batchStudents?.filter(
          (h) => !studentsWithProjects?.includes(h.student_id)
        )
      );
    }
  }, [projects, batchStudents]);
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
      setBatchStudents(resp.data);
    }
    if (selected.selectedBatches !== null) {
      fetchBatchStudents(selected.selectedBatches);
    }
  }, [selected.selectedBatches]);

  // console.log({ batches, syllabus, weeks, days });
  // console.log({ projects });

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
      </div>

      <div>
        <Title text={"Completed projects"} />
        {!!selected.selectedBatches && !!selected.selectedWeek && isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : projects !== null && projects?.length > 0 ? (
          <div className="grid grid-cols-3 mt-4 gap-4">
            {projects?.map((project) => (
              <ResultCard
                key={project.id}
                image={project.student_image}
                studentName={project.student_name}
                file={project?.file}
                setDocs={setDocs}
                setOpenDocViewer={setOpenDocViewer}
                studentId={project.student_id}
                completed={true}
                type={"project"}
              />
            ))}
          </div>
        ) : (
          <p>No one completed project</p>
        )}
      </div>

      {inCompleteProjects !== null && inCompleteProjects?.length > 0 && (
        <div>
          <Title text={"Incompleted projects"} />
          <div className="grid grid-cols-3 mt-4 gap-4">
            {inCompleteProjects?.map((project, key) => (
              <ResultCard
                key={project?.id || key}
                image={project?.student_image}
                studentName={project?.student_name}
                file={project?.file}
                setDocs={setDocs}
                setOpenDocViewer={setOpenDocViewer}
                studentId={project?.student_id}
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
