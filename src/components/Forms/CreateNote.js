import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";

function CreateNote({
  handleCreate,
  closeModal,
  selected,
  action,
  handleUpdate,
  type,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    const payload = { ...data, type: type };
    if (action === "add") {
      handleCreate(payload);
    } else {
      handleUpdate(payload);
    }
    reset();
    closeModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await http().get(`${endpoints.notes.getAll}/${selected}`);
        setValue("title", data.title);
        setValue("text", data.text);
        setValue("type", data.type);
      } catch (error) {
        console.error(error);
      }
    };
    if (action === "edit" || action === "view") {
      fetchData();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl space-y-6"
    >
      {type === "notes" ? (
        <Title
          text={
            action === "add"
              ? "Create Note"
              : action === "edit"
              ? "Edit Note"
              : "Note Details"
          }
        />
      ) : (
        <Title
          text={
            action === "add"
              ? "Create Todo"
              : action === "edit"
              ? "Edit Todo"
              : "Todo Details"
          }
        />
      )}
      <div className="space-y-2">
        <label className="font-bold">Title</label>
        <input
          type="text"
          name="title"
          disabled={action === "view"}
          className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-red-600">{errors.title.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="font-bold">Text</label>
        <textarea
          name="text"
          disabled={action === "view"}
          className="w-full px-4 py-3 border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
          {...register("text", { required: "Text is required" })}
        />
        {errors.text && (
          <span className="text-red-600">{errors.text.message}</span>
        )}
      </div>
      {action !== "view" && (
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-full"
        >
          {action === "edit" ? "Update" : "Submit"}
        </button>
      )}
    </form>
  );
}

export default CreateNote;
