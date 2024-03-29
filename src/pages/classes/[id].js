import CourseAccordion from "@/components/CourseAccordion";
import DocViewerApp from "@/components/DocViewerApp";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { endpoints } from "@/utils/endpoints";
import getFileName from "@/utils/filename";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

const updateItem = async (updatedItem) => {
  await http().put(`${endpoints.batch.getAll}/${updatedItem.id}`, updatedItem);
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

  const fetchHomeworks = () => {
    return http().get(`${endpoints.homeworks.getAll}/getByCourseId/${id}`);
  };

  const fetchQuizes = async () => {
    return await http().get(
      `${endpoints.quiz.getAll}/course/${batches?.[0]?.course_id}`
    );
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["fetchBatches"],
    queryFn: fetchBatches,
  });

  const { data: homeworks } = useQuery({
    queryKey: ["fetchHomework"],
    queryFn: fetchHomeworks,
    enabled: !!id,
  });

  console.log({ homeworks });

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

  const { data: quizs } = useQuery({
    queryKey: ["fetchMyProjects"],
    queryFn: fetchQuizes,
    enabled: !!batches?.[0]?.course_id,
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
    const filename = getFileName(path);
    const docs = [
      {
        uri: `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.getFiles}?file_path=${filename}`,
        // uri: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${path}`,
        filename: filename,
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
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold capitalize">
                  {batch.course_name}
                </h1>

                {batch?.group_id && batch.group_id !== null && (
                  <Link href={`/classes/chat/${batch.group_id}`}>
                    <div className="flex items-center justify-center gap-1.5 bg-primary text-white py-1.5 px-4 rounded-full">
                      <IoChatboxEllipsesOutline size={30} />
                      <span>Chat</span>
                    </div>
                  </Link>
                )}
              </div>
              <CourseAccordion
                data={batch.course_syllabus}
                batchId={batch.id}
                handleWeekComplete={handleWeekComplete}
                quizs={quizs}
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
