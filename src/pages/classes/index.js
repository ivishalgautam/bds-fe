import ClassCard from "@/components/Cards/Class";
import Spinner from "@/components/Spinner";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchBatches = () => {
  return http().get(endpoints.batch.getAll);
};

export default function Classes() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["fetchBatches"],
    queryFn: fetchBatches,
  });

  const calculateProgress = (syllabus) => {
    const totalDays = syllabus
      .map((s) => s.day_wise.length)
      .reduce((accu, curr) => accu + curr, 0);

    const completed = syllabus
      .map((s) => s.day_wise.filter((d) => d.is_completed))
      .map((s) => s.length)
      .reduce((accu, curr) => accu + curr, 0);

    const progress = Math.round((completed * 100) / totalDays);

    return { progress, totalDays };
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map(
          ({
            course_name,
            course_thumbnail,
            course_syllabus,
            id,
            group_id,
          }) => {
            return (
              <ClassCard
                key={id}
                id={id}
                course_name={course_name}
                course_thumbnail={course_thumbnail}
                progress={calculateProgress(course_syllabus)}
                group_id={group_id}
              />
            );
          }
        )}
      </div>
    </div>
  );
}
