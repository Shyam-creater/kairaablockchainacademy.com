import { useRouteError } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { styles } from "../styles/style";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ErrorPage() {
  const [open, setOpen] = useState(false);
  
  const [route, setRoute] = useState("Login");

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Header 
      open={open}
      setOpen={setOpen}
     
      setRoute={setRoute}
      route={route}
      />
      <div className="h-screen mt-[80px] flex flex-col items-center justify-center">
        <h1 className="text-3xl 800px:text-5xl font-bold font-poppins text-blue-500">
          Page Not Found
        </h1>
        <p className="800px:text-[30px] text-[20px]">
          Sorry, we couldn't find the page.
        </p>
        <button className={`${styles.button} !w-fit mt-8`}>
          <Link to="/">Go to Homepage</Link>
        </button>
      </div>
      <Footer />
    </div>
  );
}
