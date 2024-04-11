import { Outlet, Navigate} from 'react-router-dom';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const jwt = cookies.get("auth_token"); 
const PrivateRoute = () => {
    
    return (
        jwt ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoute;