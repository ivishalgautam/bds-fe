import { useRouter } from "next/router";
import HomeworkForm from "@/components/Forms/HomeWork";

export default function HomeworkDetails() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="bg-white p-8 rounded-xl">
      <HomeworkForm type="view" productId={id} />
    </div>
  );
}
