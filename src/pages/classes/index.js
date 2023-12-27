import ClassCard from "@/components/Cards/Class";
import Spinner from "@/components/Spinner";
import { calculateProgress } from "@/utils/calculateProgress";
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
