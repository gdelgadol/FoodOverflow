import { Outlet, Navigate} from 'react-router-dom';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const jwt = cookies.get("auth_token"); 
const ExclusiveRoute = () => {
    
    return (
        jwt ? <Navigate to="/"/> : <Outlet/>
    )
}

export default ExclusiveRoute;