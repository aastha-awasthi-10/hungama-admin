import { Redirect } from "react-router-dom";
import useSession from "react-session-hook";

const Logout = async () => {
    const session = useSession();
    // const location=useLocation();
    //console.log("---->")
    await session.removeSession();
    localStorage.clear();

    // location.pathname=="/admin"?window.location.href="/admin":"/"
    // console.log('in seesion')

    return (
        <Redirect to={window.location.pathname === "/login" ? "/login" : "/login"} />
    )
};


export default Logout