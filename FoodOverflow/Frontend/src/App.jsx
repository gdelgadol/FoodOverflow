import Login from "./pages/Login"
import Register from "./pages/Register"
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Encabezado from "./components/Encabezado.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Register",
    element:
      <Register />,
  }])
function App() {

  return (
    <div>
      <Encabezado />
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App
