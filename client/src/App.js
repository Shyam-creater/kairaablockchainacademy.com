
import { 
  WorkspaceHome, WorkspaceLearning, WorkspaceAssignments, WorkspaceResources, 
  WorkspaceLiveMeetings, WorkspaceAskDoubt, WorkspaceQuiz, WorkspaceMentor, 
  WorkspacePlacement, WorkspaceAttendance, WorkspaceCertificates, WorkspacePlaceholder, WorkspaceProjectsWrapper, CourseViewerWrapper 
} from "./components/StudentDashboardViews.js";
import { Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";

import CoursePage from "./pages/CoursePage";
import {Custom} from "./"

import StudentLayout from "./components/Student/StudentLayout";
import StudentDashboardPage from "./pages/Student/StudentDashboardPage";
import StudentCoursesPage from "./pages/Student/StudentCoursesPage";
import StudentSettingsPage from "./pages/Student/StudentSettingsPage";
import AdminPage from "./pages/Admin/AdminPage";
import CreateCoursePage from "./pages/Admin/createCoursePage";
import Courses from "./pages/Admin/Courses";
import Users from "./pages/Admin/Users";
import Staff from "./pages/Admin/Staff";
import Team from "./pages/Admin/team.js";

import EditCoursePage from "./pages/Admin/EditCoursePage.js";
import CourseAccessPage from "./pages/CourseAccessPage.js";
import UserCoursePage from "./pages/UserCoursePage.js";
import InstructorProfile from "./pages/InstructorProfile.js";
import EnquiryPage from "./pages/EnquiryPage.js";

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
import AdminBatches from "./pages/Admin/AdminBatches";
import StaffDashboardPage from "./pages/StaffDashboardPage.js";
import StaffAssignmentsPage from "./pages/Staff/StaffAssignmentsPage.js";
import StaffProjectsPage from "./pages/Staff/StaffProjectsPage.js";
import StaffDoubtCenterPage from "./pages/Staff/StaffDoubtCenterPage.js";
import StaffAttendancePage from "./pages/Staff/StaffAttendancePage.js";
import StaffCertificatesPage from "./pages/Staff/StaffCertificatesPage.js";
import StaffMeetingsPage from "./pages/Staff/StaffMeetingsPage.js";
import StaffQuizPage from "./pages/Staff/StaffQuizPage.js";
import AdminCertificateApprovalsPage from "./pages/Admin/AdminCertificateApprovalsPage.js";
import AdminCertificatePage from "./pages/Admin/AdminCertificatePage.js";
import StudentCertificatesPage from "./pages/Student/StudentCertificatesPage.js";
import VerifyCertificatePage from "./pages/VerifyCertificatePage.js";

// New Auth Pages
import AuthLayout from "./components/Auth/AuthLayout.js";
import Login from "./components/Auth/Login.js";
import ForgotPassword from "./components/Auth/ForgotPassword.js";
import ResetPassword from "./components/Auth/ResetPassword.js";
import Signup from "./components/Auth/Signup.js";
import Verification from "./components/Auth/Verification.js";
import Onboarding from "./components/Auth/Onboarding.js";
// import ErrorPage from "./pages/ErrorPage.js";


const AppLayout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/staff") || location.pathname === "/profile" || location.pathname === "/profile/dashboard";
  const isAuthRoute = ["/login", "/signup", "/verify", "/onboarding", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-surface font-poppins text-primary">
      <Custom>
        <ScrollToTop />
        <main className={`flex-grow ${isDashboardRoute || isAuthRoute ? "" : "pt-[80px]"}`}>
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
        path: "/enquire",
        element: <EnquiryPage />,
      },
      {
        path: "/login",
        element: <AuthLayout title="Welcome Back" subtitle="Sign in to continue your learning journey."><Login /></AuthLayout>,
      },
      {
        path: "/forgot-password",
        element: <AuthLayout title="Reset Password" subtitle="Regain access to your academy account."><ForgotPassword /></AuthLayout>,
      },
      {
        path: "/reset-password",
        element: <AuthLayout title="Set New Password" subtitle="Secure your academy account."><ResetPassword /></AuthLayout>,
      },
      {
        path: "/signup",
        element: <AuthLayout title="Join the Academy" subtitle="Start your Web3 journey today."><Signup /></AuthLayout>,
      },
      {
        path: "/verify",
        element: <AuthLayout title="Account Security" subtitle="Protecting your digital learning environment."><Verification /></AuthLayout>,
      },
      {
        path: "/onboarding",
        element: <AuthLayout title="Personalize your path" subtitle="Help us tailor the academy to your goals."><Onboarding /></AuthLayout>,
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
        path: "/profile",
        element: <StudentDashboardPage />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", element: <WorkspaceHome /> },
          { path: "learning", element: <WorkspaceLearning /> },
          { path: "assignments", element: <WorkspaceAssignments /> },
          { path: "projects", element: <WorkspaceProjectsWrapper /> },
          { path: "quiz", element: <WorkspaceQuiz /> },
          { path: "meetings", element: <WorkspaceLiveMeetings /> },
          { path: "ask-doubt", element: <WorkspaceAskDoubt /> },
          { path: "resources", element: <WorkspaceResources /> },
          { path: "attendance", element: <WorkspaceAttendance /> },
          { path: "certificates", element: <WorkspaceCertificates /> },
          { path: "placement", element: <WorkspacePlacement /> },
          { path: "settings", element: <WorkspacePlaceholder title="Settings & Preferences" icon="Settings" /> },
          { path: "course-viewer", element: <CourseViewerWrapper /> },
          { path: "ai-copilot", element: <WorkspaceMentor /> }
        ]
      },
      { path: "profile/course-access/:id", element: <CourseAccessPage /> },
      { path: "/instructor/:id", element: <InstructorProfile /> },
     
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
            path: "/admin/staff",
            element: <Staff />
          },
          {
            path: "/admin/certificate-approvals",
            element: <AdminCertificateApprovalsPage />
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
            element: <UserCoursePage defaultCategory="blockchain" />
          },
          {
            path: '/course/othercourse',
            element: <UserCoursePage defaultCategory="other" />
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
          },
          {
            path: "/admin/batches",
            element: <AdminBatches />
          },
          {
            path: "/admin/approvals/certificates",
            element: <StaffDashboardPage />
          },
          {
            path: "/staff/dashboard",
            element: <StaffDashboardPage />
          },
          {
            path: "/staff/assignments",
            element: <StaffAssignmentsPage />
          },
          {
            path: "/staff/projects",
            element: <StaffProjectsPage />
          },
          {
            path: "/staff/doubts",
            element: <StaffDoubtCenterPage />
          },
          {
            path: "/staff/attendance",
            element: <StaffAttendancePage />
          },
          {
            path: "/staff/certificates",
            element: <StaffCertificatesPage />
          },
          {
            path: "/staff/meetings",
            element: <StaffMeetingsPage />
          },
          {
            path: "/staff/quizzes",
            element: <StaffQuizPage />
          },
          {
            path: "/admin/certificates",
            element: <AdminCertificatePage />
          },
          {
            path: "/verify-certificate/:certificateNumber",
            element: <VerifyCertificatePage />
          }
      
    
      
     
      
    ],
    errorElement: <ErrorPage/>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

