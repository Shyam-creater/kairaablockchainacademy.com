import { Navigate } from "react-router-dom";
import useAuth from "./userAuth";
import { useSelector } from "react-redux";


export default function Protected({children}){

 

const user = useSelector((state) => state.auth.user);
const accessToken = useSelector((state) => state.auth.accessToken);

console.log("User from state:", user);
console.log("AccessToken from state:", accessToken);

    const isAuthenticated = useAuth();

    return isAuthenticated ? children : <Navigate to='/'/>
}