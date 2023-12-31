import {
  MdDashboard,
  MdBook,
  MdSpeakerNotes,
  MdQuiz,
  MdAnnouncement,
} from "react-icons/md";
import { AiOutlineShop } from "react-icons/ai";
import { FaHeadphones } from "react-icons/fa";
import { BsShopWindow } from "react-icons/bs";

// Define the roles for each user type
const ROLES = {
  ADMIN: "admin",
  MASTER_FRANCHISEE: "master_franchisee",
  SUB_FRANCHISEE: "sub_franchisee",
  TEACHER: "teacher",
  STUDENT: "student",
};

export const AllRoutes = [
  {
    label: "Dashboard",
    link: "/",
    icon: MdDashboard,
    roles: [
      ROLES.ADMIN,
      ROLES.MASTER_FRANCHISEE,
      ROLES.SUB_FRANCHISEE,
      ROLES.TEACHER,
      ROLES.STUDENT,
    ],
  },
  // { label: "Sub Admins", link: "/sub-admins", icon: BiUser },
  {
    label: "Master Franchisee",
    link: "/master-franchisee",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Master Franchisee",
    link: "/master-franchisee/create",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Master Franchisee",
    link: "/master-franchisee/edit/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Master Franchisee",
    link: "/master-franchisee/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Franchisee",
    link: "/sub-franchisee",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE],
  },
  {
    label: "Franchisee",
    link: "/sub-franchisee/create",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE],
  },
  {
    label: "Franchisee",
    link: "/sub-franchisee/edit/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE],
  },
  {
    label: "Franchisee",
    link: "/sub-franchisee/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE],
  },
  {
    label: "Levels",
    link: "/levels",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Levels",
    link: "/levels/create",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Levels",
    link: "/levels/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Levels",
    link: "/levels/edit/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Courses",
    link: "/courses",
    icon: MdBook,
    roles: [
      ROLES.ADMIN,
      ROLES.MASTER_FRANCHISEE,
      ROLES.SUB_FRANCHISEE,
      ROLES.STUDENT,
    ],
  },

  {
    label: "Courses",
    link: "/courses/create",
    icon: MdBook,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE, ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Courses",
    link: "/courses/edit/[id]",
    icon: MdBook,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE, ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Courses",
    link: "/courses/[id]",
    icon: MdBook,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE, ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Courses",
    link: "/courses/details/[id]",
    icon: MdBook,
    roles: [
      ROLES.ADMIN,
      ROLES.MASTER_FRANCHISEE,
      ROLES.SUB_FRANCHISEE,
      ROLES.STUDENT,
    ],
  },
  {
    label: "Courses Assign",
    link: "/assign-courses",
    icon: MdBook,
    roles: [ROLES.ADMIN, ROLES.MASTER_FRANCHISEE, ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Classes",
    link: "/classes",
    icon: MdBook,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Classes",
    link: "/classes/[id]",
    icon: MdBook,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Classes",
    link: "/classes/chat/[id]",
    icon: MdBook,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Presentation",
    link: "/presentation",
    icon: MdBook,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Schedules",
    link: "/schedules",
    icon: MdBook,
    roles: [ROLES.STUDENT, ROLES.TEACHER, ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Teachers",
    link: "/teachers",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Teachers",
    link: "/teachers/create",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Teachers",
    link: "/teachers/edit/[id]",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Teachers",
    link: "/teachers/[id]",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Students",
    link: "/students",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Students",
    link: "/students/create",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Students",
    link: "/students/[id]",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Students",
    link: "/students/edit/[id]",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Batches",
    link: "/batches",
    icon: MdBook,
    roles: [ROLES.SUB_FRANCHISEE],
  },
  {
    label: "Quiz",
    link: "/batches/quiz/[id]",
    icon: MdBook,
    roles: [ROLES.STUDENT],
  },
  {
    label: "Result",
    link: "/results",
    icon: MdBook,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Homework",
    link: "/homework",
    icon: MdSpeakerNotes,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Homework",
    link: "/homework/create",
    icon: MdSpeakerNotes,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Homework",
    link: "/homework/edit/[id]",
    icon: MdSpeakerNotes,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Homework",
    link: "/homework/[id]",
    icon: MdSpeakerNotes,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Homework",
    link: "/homework/upload/[courseId]/[batchId]/[week]/[day]",
    icon: MdSpeakerNotes,
    roles: [ROLES.STUDENT],
  },
  {
    label: "Student Homeworks",
    link: "/student-homeworks",
    icon: MdSpeakerNotes,
    roles: [ROLES.TEACHER],
  },
  {
    label: "Student Projects",
    link: "/student-projects",
    icon: MdSpeakerNotes,
    roles: [ROLES.TEACHER],
  },
  {
    label: "Projects",
    link: "/projects",
    icon: MdSpeakerNotes,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Homework",
    link: "/projects/upload/[courseId]/[batchId]/[week]",
    icon: MdSpeakerNotes,
    roles: [ROLES.STUDENT],
  },
  {
    label: "Quiz",
    link: "/quiz",
    icon: MdQuiz,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Quiz",
    link: "/quiz/create",
    icon: MdQuiz,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Quiz",
    link: "/quiz/edit/[id]",
    icon: MdQuiz,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Quiz",
    link: "/quiz/[id]",
    icon: MdQuiz,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Announcements",
    link: "/announcements",
    icon: MdAnnouncement,
    roles: [
      ROLES.ADMIN,
      ROLES.MASTER_FRANCHISEE,
      ROLES.SUB_FRANCHISEE,
      ROLES.TEACHER,
      ROLES.STUDENT,
    ],
  },
  {
    label: "Support",
    link: "/support",
    icon: FaHeadphones,
    roles: [
      ROLES.ADMIN,
      ROLES.MASTER_FRANCHISEE,
      ROLES.SUB_FRANCHISEE,
      ROLES.TEACHER,
      ROLES.STUDENT,
    ],
  },
  // {
  //   label: "Chat to Community",
  //   link: "/chat",
  //   icon: FaHeadphones,
  //   roles: [ROLES.TEACHER, ROLES.STUDENT],
  // },
  {
    label: "My Recordings",
    link: "/recordings",
    icon: FaHeadphones,
    roles: [ROLES.TEACHER, ROLES.STUDENT],
  },
  {
    label: "My Recordings",
    link: "/recordings/upload",
    icon: FaHeadphones,
    roles: [ROLES.TEACHER],
  },
  {
    label: "Products",
    link: "/products",
    icon: BsShopWindow,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Shop",
    link: "/shop",
    icon: BsShopWindow,
    roles: [
      ROLES.MASTER_FRANCHISEE,
      ROLES.SUB_FRANCHISEE,
      ROLES.TEACHER,
      ROLES.STUDENT,
    ],
  },
  {
    label: "Notes",
    link: "/notes",
    icon: BsShopWindow,
    roles: [ROLES.STUDENT],
  },
  {
    label: "To Dos",
    link: "/todos",
    icon: BsShopWindow,
    roles: [ROLES.STUDENT],
  },
  {
    label: "Buddy Team",
    link: "/buddy-team",
    icon: BsShopWindow,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Buddy Team",
    link: "/buddy-team/[id]",
    icon: BsShopWindow,
    roles: [ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Course enquiries",
    link: "/course-enquiries",
    icon: BsShopWindow,
    roles: [ROLES.ADMIN, ROLES.SUB_FRANCHISEE, ROLES.MASTER_FRANCHISEE],
  },
];
