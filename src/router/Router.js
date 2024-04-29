// ** Router imports

// ** GetRoutes
import { getRoutes } from "./routes"
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
// ** Hooks Imports
import { useLayout } from "@hooks/useLayout"
import { getHomeRouteForLoggedInUser, getUserData } from "../utility/Utils"
import Login from "../views/Login"
import Register from "../views/Register"
import Error from "../views/Error"

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)

  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {

      return '/login'
    }
  }

  const routes = useRoutes([
  
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ path: '/login', element: <Login /> }]
    },
    {
      path: '/register',
      element: <BlankLayout />,
      children: [{ path: '/register', element: <Register /> }]
    },

    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
