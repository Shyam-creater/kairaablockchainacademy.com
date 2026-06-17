import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";

import CoursePage from "./pages/CoursePage";
import {Custom} from "./"

import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/Admin/AdminPage";
import CreateCoursePage from "./pages/Admin/createCoursePage";
import Courses from "./pages/Admin/Courses";
import Users from "./pages/Admin/Users";
import Team from "./pages/Admin/team.js";

import EditCoursePage from "./pages/Admin/EditCoursePage.js";
import CourseAccessPage from "./pages/CourseAccessPage.js";
import UserCoursePage from "./pages/UserCoursePage.js";

import AboutPage from "./pages/AboutPage.js";
import SelfPacedCourses from "./pages/SelfPacedCourses";
import Blockchain from "./pages/Top_courses/Blockchain";
import PrivacyPolicy from "./pages/PrivacyPolicy.js"
import BootCamp from "./pages/BootCamp";
import ViewCourseDetails from "./pages/Top_courses/ViewCourseDetails";
import ViewCourseDetails1 from "./pages/Top_courses/ViewCourseDetails1";

import InternshipProgram from "./pages/Top_courses/Blockchain1";
import OtherCourse from "./pages/Top_courses/OtherCourses";
import CourseRegistration from "./pages/CourseRegistration";
import BlockChainCertification from "./pages/BlockChainCertification";
import ContactPage from "./pages/ContactPage";
import SelfBlockChainDev from "./pages/SelfBlockChainDev";
import BlogPage from "./pages/BlogPage.js";
import SingleBlogPage from "./pages/SingleBlogPage.js";
import GalleryPage from "./pages/GalleryPage.js";
import ScrollToTop from "./components/ScrollToTop.js"

import ErrorPage from "./pages/ErrorPage.js"
import Terms_and_cond from "./pages/Terms_and_cond";
import Register from "./pages/Admin/Register.js";
import UploadGalleryImagePage from "./pages/Admin/UploadGalleryImagePage.js";

import AdminGalleryPage from "./pages/Admin/AdminGalleryPage.js";
import EditGalleryImagePage from "./pages/Admin/EditGalleryImagePage.js";
import CreateBlogPage from "./pages/Admin/CreateBlogPage.js";
import EditBlogPage from "./pages/Admin/EditBlogPage.js";
import AdminBlogPage from "./pages/Admin/AdminBlogPage.js";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage.js";
import AdminOrdersPage from "./pages/Admin/AdminOrdersPage.js";
import AdminAuditLogsPage from "./pages/Admin/AdminAuditLogsPage.js";
// import ErrorPage from "./pages/ErrorPage.js";


const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-surface font-poppins text-primary">
      <Custom>
        <ScrollToTop />
        <main className={`flex-grow ${isAdmin ? "" : "pt-[80px]"}`}>
          <Outlet />
        </main>
      </Custom>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/courses",
        element: <UserCoursePage />,
      },
      {
        path: "/courses/:id",
        element: <CoursePage />,
      },
      {
        path:"/profile",
        element:<ProfilePage/>
      },
      { path: "profile/course-access/:id", element: <CourseAccessPage /> },
     
          {
            path:"/admin",
            element:<AdminPage/>
          },
          {
            path:"/admin/create-course",
            element:<CreateCoursePage/>
          },
          {
            path:"/admin/upload-gallery-image",
          element: <UploadGalleryImagePage/>
          },
          {
            path:"/admin/edit-gallery-image",
          element: <AdminGalleryPage/>
          },
          {
            path:"/admin/edit-gallery-image/:id",
            element: <EditGalleryImagePage/>
          },
          {
            path:"/admin/courses",
            element:<Courses/>
          },
          {
            path:"/admin/users",
            element:<Users/>
          },
          {
            path:"/admin/team",
            element:<Team/>
          },
          {
            path:"/admin/edit-course/:id",
            element:<EditCoursePage/>
          },
          {
            path:"/course-access/:id",
            element:<CourseAccessPage/>
          }, 

          {
            path: "/about-kairaa-blockchain-academy",
            element: <AboutPage />,
          },
          {
            path: "/blogs",
            element: <BlogPage />
          },
          {
            path: "/blogs/:id",
            element: <SingleBlogPage />
          },
          {
            path: "/gallery",
            element: <GalleryPage />
          },
          {
            path: "/contact",
            element: <ContactPage />
          },
          {
            path: "/payment-terms-condition",
            element: <Terms_and_cond />
          },
          {
            path: "/privacy-policy",
            element: <PrivacyPolicy/>
          },
    
          {
            path: '/course/selfpaced-course',
            element: <SelfPacedCourses />
          },
          {
            path: '/course/blockchain',
            element: <Blockchain />
          },
          {
            path: '/course/othercourse',
            element: <OtherCourse />
          },
          {
            path: '/course/bootcamp',
            element: <BootCamp />
          },
          {
            path: '/course/internship-program',
            element: <InternshipProgram />
    
          },
          {
            path: '/course/bockchaincertification',
            element: <BlockChainCertification />,
    
          },
          {
            path: '/course-registration',
            element: <CourseRegistration />,
    
          },
          {
            path: '/top-courses/:id',
            element: <ViewCourseDetails />,
    
          },
          {
            path: "/course/selfpaced-course/:id",
            element: <SelfBlockChainDev />
          },
          {
            path: "/course/:id",
            element: <ViewCourseDetails1 />
          },
          {
            path: "/admin/registrations",
            element: <Register />
          },
          {
            path: "/admin/create-blog",
            element: <CreateBlogPage />
          },
          {
            path: "/admin/edit-blog/:id",
            element: <EditBlogPage />
          },
          {
            path: "/admin/manage-blogs",
            element: <AdminBlogPage />
          },
          {
            path: "/admin/dashboard",
            element: <AdminDashboardPage />
          },
          {
            path: "/admin/orders",
            element: <AdminOrdersPage />
          },
          {
            path: "/admin/audit-logs",
            element: <AdminAuditLogsPage />
          }
      
    
      
     
      
    ],
    errorElement: <ErrorPage/>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
