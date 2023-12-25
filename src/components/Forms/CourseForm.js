import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CourseForm = () => {
  const [formCount, setFormCount] = useState(0);
  const [forms, setForms] = useState([{}]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleDurationChange = (event) => {
    const { value } = event.target;
    setFormCount(Number(value));
    setForms(new Array(Number(value)).fill({}));
  };

  const handleFormChange = (index, field, value) => {
    const updatedForms = [...forms];
    updatedForms[index] = {
      ...updatedForms[index],
      [field]: value,
    };
    setForms(updatedForms);
  };

  //   const handleSubmit = (event) => {
  //     event.preventDefault();
  //     console.log(forms);
  //     // Perform your submission logic here
  //   };

  const onSubmit = (data) => {
    console.log(data);
    // Perform your submission logic here
  };

  const renderForms = () => {
    return forms.map((form, index) => (
      <div key={index}>
        <select
          {...register(`forms[${index}].select`, { required: true })}
          value={form.select || ""}
          onChange={(e) => handleFormChange(index, "select", e.target.value)}
        >
          <option value="">Select</option>
          {/* Add your options here */}
        </select>
        {errors.forms && errors.forms[index]?.select && (
          <span className="text-red-600">Select is required</span>
        )}
        <input
          type="text"
          {...register(`forms[${index}].heading`, { required: true })}
          value={form.heading || ""}
          onChange={(e) => handleFormChange(index, "heading", e.target.value)}
          placeholder="Heading"
        />
        {errors.forms && errors.forms[index]?.heading && (
          <span className="text-red-600">Heading is required</span>
        )}
        <textarea
          {...register(`forms[${index}].description`, { required: true })}
          value={form.description || ""}
          onChange={(e) =>
            handleFormChange(index, "description", e.target.value)
          }
          placeholder="Description"
        />
        {errors.forms && errors.forms[index]?.description && (
          <span className="text-red-600">Description is required</span>
        )}
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="number"
          id="duration"
          placeholder="Duration"
          onChange={handleDurationChange}
        />
        {renderForms()}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CourseForm;
