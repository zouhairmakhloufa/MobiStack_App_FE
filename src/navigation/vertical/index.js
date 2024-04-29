import { Mail, Home, Box, PlusCircle } from "react-feather"

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home"
  },
  {
    id: "AddQuestion",
    title: "Add Question",
    icon: <PlusCircle size={20} />,
    navLink: "/add-question"
  },
  {
    id: "Questions",
    title: "Questions",
    icon: <Box size={20} />,
    navLink: "/questions"
  }
]
