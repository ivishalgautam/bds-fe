import CreateSchedule from "@/components/Forms/CreateSchedule";
import { useRouter } from "next/router";
import React from "react";

export default function ScheduleEdit() {
  const router = useRouter();
  const { id } = router.query;
  return <CreateSchedule type="edit" scheduleId={id} />;
}
