// ** React Imports
import { Fragment, lazy } from "react"
import { Navigate } from "react-router-dom"
// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute"

// ** Utils
import { isObjEmpty } from "@utils"
import { isUserLoggedIn } from "../../utility/Utils"






const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template"

// ** Default Route
const DefaultRoute = "/dashboardAdmin"

const Login = lazy(() => import("../../views/Login"))
const Dashboard = lazy(() => import("../../views/Dashboard"))
const DashboardAdmin = lazy(() => import("../../views/DashboardAdmin"))
const AddQuestion = lazy(() => import("../../views/AddQuestion"))
const QuestionDetail = lazy(() => import("../../views/QuestionDetail"))
const Questions = lazy(() => import("../../views/Questions"))
const EditProfile = lazy(() => import("../../views/EditProfile"))
const TableUsers = lazy(() => import("../../views/TableUsers"))
const TableQuestion = lazy(() => import("../../views/TableQuestion"))


// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
    role:['admin','user']
  },
  {
    path: "/dashboardAdmin",
    element: isUserLoggedIn() ? <DashboardAdmin /> : <Login/>,
    role:['admin']

  },
  {
    path: "/dashboard",
    element: isUserLoggedIn() ?<Dashboard /> : <Login/>,
    role:['user']

  },
  {
    path: "/questions",
    element: isUserLoggedIn() ?<Questions /> : <Login/>,
    role:['admin','user']

  },
  {
    path: "/add-question",
    element: isUserLoggedIn() ?<AddQuestion /> : <Login/>,
    role:['user']

  },
  {
    path: "/question-detail/:id",
    element: isUserLoggedIn() ?<QuestionDetail /> : <Login/>,
    role:['admin','user']

  },
  {
    path: "/edit-profile",
    element: isUserLoggedIn() ?<EditProfile /> : <Login/>,
    role:['user']


  },
  {
    path: "/users",
    element: isUserLoggedIn() ?<TableUsers /> : <Login/>,
    role:['user']


  },
  {
    path: "/table-question",
    element: isUserLoggedIn() ?<TableQuestion /> : <Login/>,
    role:['user','admin']


  },

]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)


    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
