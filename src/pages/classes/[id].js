import CourseAccordion from "@/components/CourseAccordion";
import DocViewerApp from "@/components/DocViewerApp";
import Modal from "@/components/Modal";
import PdfViewerComponent from "@/components/PPTViewer";
import Spinner from "@/components/Spinner";
import { endpoints } from "@/utils/endpoints";
import getFileName from "@/utils/filename";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

const updateItem = async (updatedItem) => {
  await http().put(`${endpoints.batch.getAll}/${updatedItem.id}`, updatedItem);
};

const fetchHomeworks = () => {
  return http().get(`${endpoints.homeworks.getAll}`);
};

const fetchUploadedHomeworks = async () => {
  return await http().get(endpoints.homeworks.myHomeworks);
};

const fetchProjects = () => {
  return http().get(`${endpoints.projects.getAll}`);
};

const fetchUploadedProjects = async () => {
  return await http().get(endpoints.projects.myProjects);
};

export default function Classes() {
  const [openDocViewer, setOpenDocViewer] = useState(false);
  const [docs, setDocs] = useState([{}]);
  const [batches, setBatches] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, isError, data } = useQuery({
    queryKey: ["fetchBatches"],
    queryFn: fetchBatches,
  });

  const { data: homeworks } = useQuery({
    queryKey: ["fetchHomework"],
    queryFn: fetchHomeworks,
  });

  const { data: myHomeworks } = useQuery({
    queryKey: ["fetchMyHomeworks"],
    queryFn: fetchUploadedHomeworks,
  });

  const { data: projects } = useQuery({
    queryKey: ["fetchProjects"],
    queryFn: fetchProjects,
  });

  const { data: myProjects } = useQuery({
    queryKey: ["fetchMyProjects"],
    queryFn: fetchUploadedProjects,
  });

  useEffect(() => {
    if (!isLoading) {
      setBatches(data?.filter((d) => d.id === id));
    }
  }, [data]);

  const queryClient = useQueryClient();

  const updateMutation = useMutation((updatedItem) => updateItem(updatedItem), {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success("Batch updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update Batch.");
    },
  });

  const handleUpdateBatch = (itemId, updatedItem) => {
    updateMutation.mutate(itemId, updatedItem);
  };

  function handleWeekComplete(batchId, weeks, status, days) {
    const updatedBatches = batches.map((batch) => {
      if (batch.id === batchId) {
        return {
          ...batch,
          course_syllabus: [
            ...batch.course_syllabus.map((ele) =>
              ele.weeks === weeks
                ? {
                    ...ele,
                    day_wise: [
                      ...ele.day_wise.map((item) =>
                        item.days === days
                          ? { ...item, is_completed: status }
                          : item
                      ),
                    ],
                  }
                : ele
            ),
          ],
        };
      }
      return batch;
    });
    setBatches(updatedBatches);
    handleUpdateBatch(
      updatedBatches.filter((batch) => batch.id === batchId)[0]
    );
  }

  const openDoc = (path) => {
    const docs = [
      {
        uri: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${path}`,
        filename: getFileName(path),
      },
    ];

    setDocs(docs);
    setOpenDocViewer(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="font-mulish">
      <div className="grid gap-6">
        {batches?.map((batch) => {
          return (
            <div className="p-4 bg-white rounded-md space-y-6" key={batch.id}>
              <h1 className="text-2xl font-bold capitalize">
                {batch.course_name}
              </h1>
              <CourseAccordion
                data={batch.course_syllabus}
                batchId={batch.id}
                handleWeekComplete={handleWeekComplete}
                quizs={batch.quiz}
                homeworks={homeworks?.filter(
                  (homework) => homework.course_id === batch.course_id
                )}
                myHomeworks={myHomeworks}
                projects={projects}
                myProjects={myProjects}
                openDoc={openDoc}
                type="class"
              />
            </div>
          );
        })}
      </div>
      <Modal isOpen={openDocViewer} onClose={() => setOpenDocViewer(false)}>
        <DocViewerApp docs={docs} />
      </Modal>
    </div>
  );
}
