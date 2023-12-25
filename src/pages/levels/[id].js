import LevelForm from "@/components/Forms/Level";
import { useRouter } from "next/router";
import React from "react";

export default function ViewLevel() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <LevelForm type={"view"} id={id} />
    </div>
  );
}
