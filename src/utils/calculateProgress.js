export const calculateProgress = (syllabus) => {
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

export const calculateLevelProgress = (userPoints, totalPoints) => {
  return (userPoints * 100) / totalPoints;
};
