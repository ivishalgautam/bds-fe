import CreateTeacher from "@/components/Forms/CreateTeacher";
import { useRouter } from "next/router";

function Detail() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="bg-white p-8 rounded-xl">
      <CreateTeacher userRole="student" type="view" id={id} />
    </div>
  );
}

export default Detail;
