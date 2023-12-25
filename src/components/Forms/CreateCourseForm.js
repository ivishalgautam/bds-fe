// // // // // import React, { useState } from "react";

// // // // // const initialWeek = {
// // // // //   weeks: "",
// // // // //   day_wise: [
// // // // //     {
// // // // //       days: "",
// // // // //       heading: "",
// // // // //       description: "",
// // // // //     },
// // // // //   ],
// // // // // };

// // // // // const initialCourse = {
// // // // //   course_name: "",
// // // // //   duration: "",
// // // // //   regular_price: "",
// // // // //   discount_price: "",
// // // // //   course_description: "",
// // // // //   course_syllabus: [initialWeek],
// // // // // };

// // // // // const CreateCourseForm = () => {
// // // // //   const [courseData, setCourseData] = useState(initialCourse);

// // // // //   const handleInputChange = (e, index, nestedIndex) => {
// // // // //     const { name, value } = e.target;
// // // // //     setCourseData((prevData) => {
// // // // //       const newData = { ...prevData };
// // // // //       if (index !== undefined && nestedIndex !== undefined) {
// // // // //         newData.course_syllabus[index].day_wise[nestedIndex][name] = value;
// // // // //       } else {
// // // // //         newData[name] = value;
// // // // //       }
// // // // //       return newData;
// // // // //     });
// // // // //   };

// // // // //   const handleAddWeek = () => {
// // // // //     setCourseData((prevData) => ({
// // // // //       ...prevData,
// // // // //       course_syllabus: [...prevData.course_syllabus, initialWeek],
// // // // //     }));
// // // // //   };

// // // // //   const handleAddDayWise = (index) => {
// // // // //     setCourseData((prevData) => {
// // // // //       const newData = { ...prevData };
// // // // //       newData.course_syllabus[index].day_wise.push({
// // // // //         days: "",
// // // // //         heading: "",
// // // // //         description: "",
// // // // //       });
// // // // //       return newData;
// // // // //     });
// // // // //   };

// // // // //   const handleSubmit = (e) => {
// // // // //     e.preventDefault();
// // // // //     console.log("Form Data:", courseData);
// // // // //   };

// // // // //   return (
// // // // //     <form onSubmit={handleSubmit}>
// // // // //       <label>
// // // // //         Course Name:
// // // // //         <input
// // // // //           type="text"
// // // // //           name="course_name"
// // // // //           value={courseData.course_name}
// // // // //           onChange={handleInputChange}
// // // // //           required
// // // // //         />
// // // // //       </label>
// // // // //       <br />
// // // // //       <label>
// // // // //         Duration (in weeks):
// // // // //         <input
// // // // //           type="number"
// // // // //           name="duration"
// // // // //           value={courseData.duration}
// // // // //           onChange={handleInputChange}
// // // // //           required
// // // // //         />
// // // // //       </label>
// // // // //       <br />
// // // // //       <label>
// // // // //         Regular Price:
// // // // //         <input
// // // // //           type="number"
// // // // //           name="regular_price"
// // // // //           value={courseData.regular_price}
// // // // //           onChange={handleInputChange}
// // // // //           required
// // // // //         />
// // // // //       </label>
// // // // //       <br />
// // // // //       <label>
// // // // //         Discount Price (Optional):
// // // // //         <input
// // // // //           type="number"
// // // // //           name="discount_price"
// // // // //           value={courseData.discount_price}
// // // // //           onChange={handleInputChange}
// // // // //         />
// // // // //       </label>
// // // // //       <br />
// // // // //       <label>
// // // // //         Course Description:
// // // // //         <textarea
// // // // //           name="course_description"
// // // // //           value={courseData.course_description}
// // // // //           onChange={handleInputChange}
// // // // //           required
// // // // //         />
// // // // //       </label>
// // // // //       <br />
// // // // //       {courseData.course_syllabus.map((week, index) => (
// // // // //         <div key={index}>
// // // // //           <h3>Week {index + 1}</h3>
// // // // //           <label>
// // // // //             Weeks:
// // // // //             <input
// // // // //               type="number"
// // // // //               name="weeks"
// // // // //               value={week.weeks}
// // // // //               onChange={(e) => handleInputChange(e, index)}
// // // // //               required
// // // // //             />
// // // // //           </label>
// // // // //           <br />
// // // // //           {week.day_wise.map((day, nestedIndex) => (
// // // // //             <div key={nestedIndex}>
// // // // //               <h4>Day {nestedIndex + 1}</h4>
// // // // //               <label>
// // // // //                 Days:
// // // // //                 <input
// // // // //                   type="number"
// // // // //                   name="days"
// // // // //                   value={day.days}
// // // // //                   onChange={(e) => handleInputChange(e, index, nestedIndex)}
// // // // //                   required
// // // // //                 />
// // // // //               </label>
// // // // //               <br />
// // // // //               <label>
// // // // //                 Heading:
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   name="heading"
// // // // //                   value={day.heading}
// // // // //                   onChange={(e) => handleInputChange(e, index, nestedIndex)}
// // // // //                   required
// // // // //                 />
// // // // //               </label>
// // // // //               <br />
// // // // //               <label>
// // // // //                 Description:
// // // // //                 <textarea
// // // // //                   name="description"
// // // // //                   value={day.description}
// // // // //                   onChange={(e) => handleInputChange(e, index, nestedIndex)}
// // // // //                   required
// // // // //                 />
// // // // //               </label>
// // // // //               <br />
// // // // //             </div>
// // // // //           ))}
// // // // //           <button type="button" onClick={() => handleAddDayWise(index)}>
// // // // //             Add Day
// // // // //           </button>
// // // // //           <br />
// // // // //         </div>
// // // // //       ))}
// // // // //       <button type="button" onClick={handleAddWeek}>
// // // // //         Add Week
// // // // //       </button>
// // // // //       <br />
// // // // //       <button type="submit">Submit</button>
// // // // //     </form>
// // // // //   );
// // // // // };

// // // // // export default CreateCourseForm;

// // // // import React, { useState } from "react";

// // // // const initialSyllabus = {
// // // //   weeks: "",
// // // //   day_wise: [
// // // //     {
// // // //       days: "",
// // // //       heading: "",
// // // //       description: "",
// // // //     },
// // // //   ],
// // // // };

// // // // const CreateCourseForm = () => {
// // // //   const [course, setCourse] = useState({
// // // //     course_name: "",
// // // //     duration: "",
// // // //     regular_price: "",
// // // //     discount_price: "",
// // // //     course_description: "",
// // // //     course_syllabus: [initialSyllabus],
// // // //   });

// // // //   const [errors, setErrors] = useState({});

// // // //   const handleInputChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setCourse({ ...course, [name]: value });
// // // //   };

// // // //   const handleSyllabusChange = (index, field, value) => {
// // // //     const updatedSyllabus = [...course.course_syllabus];
// // // //     updatedSyllabus[index][field] = value;
// // // //     setCourse({ ...course, course_syllabus: updatedSyllabus });
// // // //   };

// // // //   const handleAddWeek = () => {
// // // //     const newSyllabus = { ...initialSyllabus };
// // // //     setCourse({
// // // //       ...course,
// // // //       course_syllabus: [...course.course_syllabus, newSyllabus],
// // // //     });
// // // //   };

// // // //   const handleAddDay = (index) => {
// // // //     const newDay = {
// // // //       days: 1,
// // // //       heading: "",
// // // //       description: "",
// // // //     };
// // // //     const updatedSyllabus = [...course.course_syllabus];
// // // //     updatedSyllabus[index].day_wise.push(newDay);
// // // //     setCourse({ ...course, course_syllabus: updatedSyllabus });
// // // //   };

// // // //   const handleSubmit = (e) => {
// // // //     e.preventDefault();
// // // //     // Perform validation
// // // //     const errors = {};
// // // //     if (!course.course_name) {
// // // //       errors.course_name = "Course name is required";
// // // //     }
// // // //     if (!course.duration) {
// // // //       errors.duration = "Duration is required";
// // // //     }
// // // //     // Add more validation rules here

// // // //     if (Object.keys(errors).length === 0) {
// // // //       // Validation passed, submit the form or perform further actions
// // // //       console.log("Form submitted:", course);
// // // //     } else {
// // // //       setErrors(errors);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h2>Course Form</h2>
// // // //       <form onSubmit={handleSubmit}>
// // // //         <div>
// // // //           <label>Course Name:</label>
// // // //           <input
// // // //             type="text"
// // // //             name="course_name"
// // // //             value={course.course_name}
// // // //             onChange={handleInputChange}
// // // //           />
// // // //           {errors.course_name && <span>{errors.course_name}</span>}
// // // //         </div>

// // // //         <div>
// // // //           <label>Duration:</label>
// // // //           <input
// // // //             type="text"
// // // //             name="duration"
// // // //             value={course.duration}
// // // //             onChange={handleInputChange}
// // // //           />
// // // //           {errors.duration && <span>{errors.duration}</span>}
// // // //         </div>

// // // //         <div>
// // // //           <label>Regular Price:</label>
// // // //           <input
// // // //             type="number"
// // // //             name="regular_price"
// // // //             value={course.regular_price}
// // // //             onChange={handleInputChange}
// // // //           />
// // // //         </div>

// // // //         <div>
// // // //           <label>Discount Price:</label>
// // // //           <input
// // // //             type="number"
// // // //             name="discount_price"
// // // //             value={course.discount_price}
// // // //             onChange={handleInputChange}
// // // //           />
// // // //         </div>

// // // //         <div>
// // // //           <label>Course Description:</label>
// // // //           <textarea
// // // //             name="course_description"
// // // //             value={course.course_description}
// // // //             onChange={handleInputChange}
// // // //           />
// // // //         </div>

// // // //         <div>
// // // //           <label>Course Syllabus:</label>
// // // //           {course.course_syllabus.map((week, index) => (
// // // //             <div key={index}>
// // // //               <div>
// // // //                 <label>Weeks:</label>
// // // //                 <input
// // // //                   type="number"
// // // //                   value={week.weeks}
// // // //                   onChange={(e) =>
// // // //                     handleSyllabusChange(index, "weeks", e.target.value)
// // // //                   }
// // // //                 />
// // // //               </div>
// // // //               {week.day_wise.map((day, dayIndex) => (
// // // //                 <div key={dayIndex}>
// // // //                   <div>
// // // //                     <label>Days:</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       value={day.days}
// // // //                       onChange={(e) =>
// // // //                         handleSyllabusChange(
// // // //                           index,
// // // //                           `day_wise.${dayIndex}.days`,
// // // //                           e.target.value
// // // //                         )
// // // //                       }
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label>Heading:</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       value={day.heading}
// // // //                       onChange={(e) =>
// // // //                         handleSyllabusChange(
// // // //                           index,
// // // //                           `day_wise.${dayIndex}.heading`,
// // // //                           e.target.value
// // // //                         )
// // // //                       }
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label>Description:</label>
// // // //                     <textarea
// // // //                       value={day.description}
// // // //                       onChange={(e) =>
// // // //                         handleSyllabusChange(
// // // //                           index,
// // // //                           `day_wise.${dayIndex}.description`,
// // // //                           e.target.value
// // // //                         )
// // // //                       }
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //               <button type="button" onClick={() => handleAddDay(index)}>
// // // //                 Add Day
// // // //               </button>
// // // //             </div>
// // // //           ))}
// // // //           <button type="button" onClick={handleAddWeek}>
// // // //             Add Week
// // // //           </button>
// // // //         </div>

// // // //         <button type="submit">Submit</button>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CreateCourseForm;

// // // import React, { useState } from "react";

// // // const CourseForm = () => {
// // //   const [courseData, setCourseData] = useState({
// // //     course_name: "",
// // //     duration: "",
// // //     regular_price: "",
// // //     discount_price: "",
// // //     course_description: "",
// // //     course_syllabus: [
// // //       {
// // //         weeks: "",
// // //         day_wise: [
// // //           {
// // //             days: "",
// // //             heading: "",
// // //             description: "",
// // //           },
// // //         ],
// // //       },
// // //     ],
// // //   });

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       [name]: value,
// // //     }));
// // //   };

// // //   const handleSyllabusChange = (e, syllabusIndex) => {
// // //     const { name, value } = e.target;
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: prevData.course_syllabus.map((syllabus, index) =>
// // //         index === syllabusIndex ? { ...syllabus, [name]: value } : syllabus
// // //       ),
// // //     }));
// // //   };

// // //   const handleWeekChange = (e, syllabusIndex, weekIndex) => {
// // //     const { name, value } = e.target;
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: prevData.course_syllabus.map(
// // //         (syllabus, currentSyllabusIndex) =>
// // //           currentSyllabusIndex === syllabusIndex
// // //             ? {
// // //                 ...syllabus,
// // //                 weeks: syllabus.weeks.map((week, currentWeekIndex) =>
// // //                   currentWeekIndex === weekIndex
// // //                     ? { ...week, [name]: value }
// // //                     : week
// // //                 ),
// // //               }
// // //             : syllabus
// // //       ),
// // //     }));
// // //   };

// // //   const handleDayChange = (e, syllabusIndex, weekIndex, dayIndex) => {
// // //     const { name, value } = e.target;
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: prevData.course_syllabus.map(
// // //         (syllabus, currentSyllabusIndex) =>
// // //           currentSyllabusIndex === syllabusIndex
// // //             ? {
// // //                 ...syllabus,
// // //                 weeks: syllabus.weeks.map((week, currentWeekIndex) =>
// // //                   currentWeekIndex === weekIndex
// // //                     ? {
// // //                         ...week,
// // //                         day_wise: week.day_wise.map((day, currentDayIndex) =>
// // //                           currentDayIndex === dayIndex
// // //                             ? { ...day, [name]: value }
// // //                             : day
// // //                         ),
// // //                       }
// // //                     : week
// // //                 ),
// // //               }
// // //             : syllabus
// // //       ),
// // //     }));
// // //   };

// // //   const handleAddSyllabus = () => {
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: [
// // //         ...prevData.course_syllabus,
// // //         {
// // //           weeks: "",
// // //           day_wise: [
// // //             {
// // //               days: "",
// // //               heading: "",
// // //               description: "",
// // //             },
// // //           ],
// // //         },
// // //       ],
// // //     }));
// // //   };

// // //   const handleAddWeek = (syllabusIndex) => {
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: prevData.course_syllabus.map((syllabus, index) =>
// // //         index === syllabusIndex
// // //           ? {
// // //               ...syllabus,
// // //               weeks: [
// // //                 ...syllabus.weeks,
// // //                 {
// // //                   days: "",
// // //                   heading: "",
// // //                   description: "",
// // //                 },
// // //               ],
// // //             }
// // //           : syllabus
// // //       ),
// // //     }));
// // //   };

// // //   const handleRemoveSyllabus = (syllabusIndex) => {
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: prevData.course_syllabus.filter(
// // //         (_, index) => index !== syllabusIndex
// // //       ),
// // //     }));
// // //   };

// // //   const handleRemoveWeek = (syllabusIndex, weekIndex) => {
// // //     setCourseData((prevData) => ({
// // //       ...prevData,
// // //       course_syllabus: prevData.course_syllabus.map((syllabus, index) =>
// // //         index === syllabusIndex
// // //           ? {
// // //               ...syllabus,
// // //               weeks: syllabus.weeks.filter(
// // //                 (_, currentWeekIndex) => currentWeekIndex !== weekIndex
// // //               ),
// // //             }
// // //           : syllabus
// // //       ),
// // //     }));
// // //   };

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     // You can perform further actions with the courseData, such as sending it to an API endpoint
// // //     console.log(courseData);
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit}>
// // //       <div>
// // //         <label htmlFor="course_name">Course Name:</label>
// // //         <input
// // //           type="text"
// // //           id="course_name"
// // //           name="course_name"
// // //           value={courseData.course_name}
// // //           onChange={handleChange}
// // //         />
// // //       </div>
// // //       <div>
// // //         <label htmlFor="duration">Duration (in weeks):</label>
// // //         <input
// // //           type="number"
// // //           id="duration"
// // //           name="duration"
// // //           value={courseData.duration}
// // //           onChange={handleChange}
// // //         />
// // //       </div>
// // //       <div>
// // //         <label htmlFor="regular_price">Regular Price:</label>
// // //         <input
// // //           type="number"
// // //           id="regular_price"
// // //           name="regular_price"
// // //           value={courseData.regular_price}
// // //           onChange={handleChange}
// // //         />
// // //       </div>
// // //       <div>
// // //         <label htmlFor="discount_price">Discount Price (optional):</label>
// // //         <input
// // //           type="number"
// // //           id="discount_price"
// // //           name="discount_price"
// // //           value={courseData.discount_price}
// // //           onChange={handleChange}
// // //         />
// // //       </div>
// // //       <div>
// // //         <label htmlFor="course_description">Course Description:</label>
// // //         <textarea
// // //           id="course_description"
// // //           name="course_description"
// // //           value={courseData.course_description}
// // //           onChange={handleChange}
// // //         />
// // //       </div>
// // //       {courseData.course_syllabus.map((syllabus, syllabusIndex) => (
// // //         <div key={syllabusIndex}>
// // //           <h3>Syllabus {syllabusIndex + 1}</h3>
// // //           <div>
// // //             <label htmlFor={`weeks_${syllabusIndex}`}>Weeks:</label>
// // //             <input
// // //               type="number"
// // //               id={`weeks_${syllabusIndex}`}
// // //               name="weeks"
// // //               value={syllabus.weeks}
// // //               onChange={(e) => handleWeekChange(e, syllabusIndex)}
// // //             />
// // //           </div>
// // //           {syllabus.weeks.map((week, weekIndex) => (
// // //             <div key={weekIndex}>
// // //               <h4>Week {weekIndex + 1}</h4>
// // //               <div>
// // //                 <label htmlFor={`days_${syllabusIndex}_${weekIndex}`}>
// // //                   Days:
// // //                 </label>
// // //                 <input
// // //                   type="number"
// // //                   id={`days_${syllabusIndex}_${weekIndex}`}
// // //                   name="days"
// // //                   value={week.days}
// // //                   onChange={(e) => handleDayChange(e, syllabusIndex, weekIndex)}
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label htmlFor={`heading_${syllabusIndex}_${weekIndex}`}>
// // //                   Heading:
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   id={`heading_${syllabusIndex}_${weekIndex}`}
// // //                   name="heading"
// // //                   value={week.heading}
// // //                   onChange={(e) => handleDayChange(e, syllabusIndex, weekIndex)}
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label htmlFor={`description_${syllabusIndex}_${weekIndex}`}>
// // //                   Description:
// // //                 </label>
// // //                 <textarea
// // //                   id={`description_${syllabusIndex}_${weekIndex}`}
// // //                   name="description"
// // //                   value={week.description}
// // //                   onChange={(e) => handleDayChange(e, syllabusIndex, weekIndex)}
// // //                 />
// // //               </div>
// // //               {weekIndex !== syllabus.weeks.length - 1 && (
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => handleRemoveWeek(syllabusIndex, weekIndex)}
// // //                 >
// // //                   Remove Week
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ))}
// // //           {syllabusIndex !== courseData.course_syllabus.length - 1 && (
// // //             <button
// // //               type="button"
// // //               onClick={() => handleRemoveSyllabus(syllabusIndex)}
// // //             >
// // //               Remove Syllabus
// // //             </button>
// // //           )}
// // //           <hr />
// // //         </div>
// // //       ))}
// // //       <button type="button" onClick={handleAddSyllabus}>
// // //         Add Syllabus
// // //       </button>
// // //       <button type="submit">Submit</button>
// // //     </form>
// // //   );
// // // };

// // // export default CourseForm;

// // import React from "react";
// // import { useForm, useFieldArray } from "react-hook-form";

// // const CourseForm = () => {
// //   const {
// //     register,
// //     control,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm();

// //   const { fields, append, remove } = useFieldArray({
// //     control,
// //     name: "course_syllabus",
// //   });

// //   const onSubmit = (data) => {
// //     console.log(data);
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(onSubmit)}>
// //       <div>
// //         <label htmlFor="course_name">Course Name:</label>
// //         <input {...register("course_name")} type="text" id="course_name" />
// //       </div>
// //       <div>
// //         <label htmlFor="duration">Duration (in weeks):</label>
// //         <input {...register("duration")} type="text" id="duration" />
// //       </div>
// //       <div>
// //         <label htmlFor="regular_price">Regular Price:</label>
// //         <input
// //           {...register("regular_price")}
// //           type="number"
// //           id="regular_price"
// //         />
// //       </div>
// //       <div>
// //         <label htmlFor="discount_price">Discount Price (optional):</label>
// //         <input
// //           {...register("discount_price")}
// //           type="number"
// //           id="discount_price"
// //         />
// //       </div>
// //       <div>
// //         <label htmlFor="course_description">Course Description:</label>
// //         <textarea {...register("course_description")} id="course_description" />
// //       </div>
// //       <div>
// //         <h3>Course Syllabus</h3>
// //         {fields.map((item, index) => (
// //           <div key={item.id}>
// //             <h4>Week {index + 1}</h4>
// //             <div>
// //               <label htmlFor={`course_syllabus[${index}].weeks`}>Weeks:</label>
// //               <input
// //                 {...register(`course_syllabus[${index}].weeks`)}
// //                 type="number"
// //                 id={`course_syllabus[${index}].weeks`}
// //               />
// //             </div>
// //             {item.day_wise.map((day, dayIndex) => (
// //               <div key={day.id}>
// //                 <h5>Day {dayIndex + 1}</h5>
// //                 <div>
// //                   <label
// //                     htmlFor={`course_syllabus[${index}].day_wise[${dayIndex}].days`}
// //                   >
// //                     Days:
// //                   </label>
// //                   <input
// //                     {...register(
// //                       `course_syllabus[${index}].day_wise[${dayIndex}].days`
// //                     )}
// //                     type="number"
// //                     id={`course_syllabus[${index}].day_wise[${dayIndex}].days`}
// //                   />
// //                 </div>
// //                 <div>
// //                   <label
// //                     htmlFor={`course_syllabus[${index}].day_wise[${dayIndex}].heading`}
// //                   >
// //                     Heading:
// //                   </label>
// //                   <input
// //                     {...register(
// //                       `course_syllabus[${index}].day_wise[${dayIndex}].heading`
// //                     )}
// //                     type="text"
// //                     id={`course_syllabus[${index}].day_wise[${dayIndex}].heading`}
// //                   />
// //                 </div>
// //                 <div>
// //                   <label
// //                     htmlFor={`course_syllabus[${index}].day_wise[${dayIndex}].description`}
// //                   >
// //                     Description:
// //                   </label>
// //                   <textarea
// //                     {...register(
// //                       `course_syllabus[${index}].day_wise[${dayIndex}].description`
// //                     )}
// //                     id={`course_syllabus[${index}].day_wise[${dayIndex}].description`}
// //                   />
// //                 </div>
// //               </div>
// //             ))}
// //             <button type="button" onClick={() => append({ day_wise: [] })}>
// //               Add Week
// //             </button>
// //             <button type="button" onClick={() => remove(index)}>
// //               Remove Week
// //             </button>
// //           </div>
// //         ))}
// //         <button
// //           type="button"
// //           onClick={() => append({ weeks: "", day_wise: [] })}
// //         >
// //           Add Syllabus
// //         </button>
// //       </div>
// //       <button type="submit">Submit</button>
// //     </form>
// //   );
// // };

// // export default CourseForm;
// import React from "react";
// import { useForm, useFieldArray } from "react-hook-form";

// const CourseForm = () => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const {
//     fields: syllabusFields,
//     append: appendSyllabus,
//     remove: removeSyllabus,
//   } = useFieldArray({
//     control,
//     name: "course_syllabus",
//   });

//   const {
//     fields: dayFields,
//     append: appendDay,
//     remove: removeDay,
//   } = useFieldArray({
//     control,
//     name: "course_syllabus[].day_wise",
//   });

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <label htmlFor="course_name">Course Name:</label>
//         <input {...register("course_name")} type="text" id="course_name" />
//       </div>
//       <div>
//         <label htmlFor="duration">Duration (in weeks):</label>
//         <input {...register("duration")} type="text" id="duration" />
//       </div>
//       <div>
//         <label htmlFor="regular_price">Regular Price:</label>
//         <input
//           {...register("regular_price")}
//           type="number"
//           id="regular_price"
//         />
//       </div>
//       <div>
//         <label htmlFor="discount_price">Discount Price (optional):</label>
//         <input
//           {...register("discount_price")}
//           type="number"
//           id="discount_price"
//         />
//       </div>
//       <div>
//         <label htmlFor="course_description">Course Description:</label>
//         <textarea {...register("course_description")} id="course_description" />
//       </div>
//       <div>
//         <h3>Course Syllabus</h3>
//         {syllabusFields.map((syllabus, syllabusIndex) => (
//           <div key={syllabus.id}>
//             <h4>Week {syllabusIndex + 1}</h4>
//             <div>
//               <label htmlFor={`course_syllabus[${syllabusIndex}].weeks`}>
//                 Weeks:
//               </label>
//               <input
//                 {...register(`course_syllabus[${syllabusIndex}].weeks`)}
//                 type="number"
//                 id={`course_syllabus[${syllabusIndex}].weeks`}
//               />
//             </div>
//             {syllabus.day_wise.map((day, dayIndex) => (
//               <div key={day.id}>
//                 <h5>Day {dayIndex + 1}</h5>
//                 <div>
//                   <label
//                     htmlFor={`course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].days`}
//                   >
//                     Days:
//                   </label>
//                   <input
//                     {...register(
//                       `course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].days`
//                     )}
//                     type="number"
//                     id={`course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].days`}
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor={`course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].heading`}
//                   >
//                     Heading:
//                   </label>
//                   <input
//                     {...register(
//                       `course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].heading`
//                     )}
//                     type="text"
//                     id={`course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].heading`}
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor={`course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].description`}
//                   >
//                     Description:
//                   </label>
//                   <textarea
//                     {...register(
//                       `course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].description`
//                     )}
//                     id={`course_syllabus[${syllabusIndex}].day_wise[${dayIndex}].description`}
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => removeDay(syllabusIndex, dayIndex)}
//                 >
//                   Remove Day
//                 </button>
//               </div>
//             ))}
//             <button type="button" onClick={() => appendDay(syllabusIndex, {})}>
//               Add Day
//             </button>
//             <button type="button" onClick={() => removeSyllabus(syllabusIndex)}>
//               Remove Week
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => appendSyllabus({ weeks: "", day_wise: [] })}
//         >
//           Add Week
//         </button>
//       </div>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default CourseForm;

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

const CourseForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    fields: syllabusFields,
    append: appendSyllabus,
    remove: removeSyllabus,
  } = useFieldArray({
    control,
    name: "course_syllabus",
  });

  const {
    fields: weekFields,
    append: appendWeek,
    remove: removeWeek,
  } = useFieldArray({
    control,
    name: "course_syllabus[].week",
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control,
    name: "course_syllabus[].week[].day_wise",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="course_name">Course Name:</label>
        <input {...register("course_name")} type="text" id="course_name" />
      </div>
      <div>
        <label htmlFor="duration">Duration (in weeks):</label>
        <input {...register("duration")} type="text" id="duration" />
      </div>
      <div>
        <label htmlFor="regular_price">Regular Price:</label>
        <input
          {...register("regular_price")}
          type="number"
          id="regular_price"
        />
      </div>
      <div>
        <label htmlFor="discount_price">Discount Price (optional):</label>
        <input
          {...register("discount_price")}
          type="number"
          id="discount_price"
        />
      </div>
      <div>
        <label htmlFor="course_description">Course Description:</label>
        <textarea {...register("course_description")} id="course_description" />
      </div>
      <div>
        <h3>Course Syllabus</h3>
        {syllabusFields.map((syllabus, syllabusIndex) => (
          <div key={syllabus.id}>
            <h4>Week {syllabusIndex + 1}</h4>
            <div>
              <label htmlFor={`course_syllabus[${syllabusIndex}].week[].weeks`}>
                Weeks:
              </label>
              <input
                {...register(`course_syllabus[${syllabusIndex}].week[].weeks`)}
                type="number"
                id={`course_syllabus[${syllabusIndex}].week[].weeks`}
              />
            </div>
            {syllabus.week.map((week, weekIndex) => (
              <div key={week.id}>
                <h5>Day-wise details for Week {weekIndex + 1}</h5>
                {week.day_wise.map((day, dayIndex) => (
                  <div key={day.id}>
                    <h6>Day {dayIndex + 1}</h6>
                    <div>
                      <label
                        htmlFor={`course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].days`}
                      >
                        Days:
                      </label>
                      <input
                        {...register(
                          `course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].days`
                        )}
                        type="number"
                        id={`course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].days`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].heading`}
                      >
                        Heading:
                      </label>
                      <input
                        {...register(
                          `course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].heading`
                        )}
                        type="text"
                        id={`course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].heading`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].description`}
                      >
                        Description:
                      </label>
                      <textarea
                        {...register(
                          `course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].description`
                        )}
                        id={`course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise[${dayIndex}].description`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeDay(syllabusIndex, weekIndex, dayIndex)
                      }
                    >
                      Remove Day
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendDay(
                      `course_syllabus[${syllabusIndex}].week[${weekIndex}].day_wise`,
                      {}
                    )
                  }
                >
                  Add Day
                </button>
                <button
                  type="button"
                  onClick={() => removeWeek(syllabusIndex, weekIndex)}
                >
                  Remove Week
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendWeek(`course_syllabus[${syllabusIndex}].week`, {
                  days: [],
                  heading: "",
                  description: "",
                })
              }
            >
              Add Week
            </button>
            <button type="button" onClick={() => removeSyllabus(syllabusIndex)}>
              Remove Syllabus
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            appendSyllabus({
              week: [{ days: [], heading: "", description: "" }],
            })
          }
        >
          Add Syllabus
        </button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CourseForm;
