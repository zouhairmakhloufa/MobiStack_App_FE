import {  Home, Box, PlusCircle, User, Grid } from "react-feather"

export default [
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
    role:['user'],
  },
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboardAdmin",
    role:['admin'],
  },
  {
    id: "Users",
    title: "Users",
    icon: <User size={20} />,
    navLink: "/users",
    role:['admin'],
  },
  {
    id: "TableQuestion",
    title: "Table Question",
    icon: <Grid size={20} />,
    navLink: "/table-question",
    role:['admin','user'],
  },
  {
    id: "AddQuestion",
    title: "Add Question",
    icon: <PlusCircle size={20} />,
    navLink: "/add-question",
    role:['user'],

  },
  {
    id: "Questions",
    title: "Questions",
    icon: <Box size={20} />,
    navLink: "/questions",
    role:['user','admin'],

  }
]
