import { useEffect, useState } from "react"
import { createBrowserRouter, Router, RouterProvider, useNavigate } from "react-router-dom"
import Root from "./pages/Root"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Post from "./pages/Post"
import Auth from "./pages/Auth"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Login /> },
      { path: "home", element: <Home /> },
      
      { path: "post", element: <Post /> },
      { path: "auth", element: <Auth /> }
    ]
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App