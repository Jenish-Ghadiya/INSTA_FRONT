import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "../components/auth/PublicRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import EmailVerification from "../components/auth/EmailVerification";
import OtpVerification from "../components/auth/OtpVerification";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordEmail from "../components/auth/forgtpassword/ForgotPasswordEmail";
import ForgotPasswordOTP from "../components/auth/forgtpassword/ForgotPasswordOTP";
import ResetPassword from "../components/auth/forgtpassword/ResetPassword";
import Home from "../components/home/index";
import DefaultLayout from "./defaultLayout/defaultlayout";
import Profile from "../components/profile";
import Edit from "../components/profile/edit";
import CreatePost from "../components/post/CreatePost";
import PostDetail from "../components/post/PostDetail";
import ExplorePost from "../components/post/ExplorePost";

const router = createBrowserRouter([
    {
        path: "/email-verification",
        element: (
            <PublicRoute>
                <EmailVerification />
            </PublicRoute>
        ),
    },
    {
        path: "/verify-otp/:id",
        element: (
            <PublicRoute>
                <OtpVerification />
            </PublicRoute>
        ),
    },
    {
        path: "/create-account/:id",
        element: (
            <PublicRoute>
                <SignupForm />
            </PublicRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginForm />
            </PublicRoute>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <PublicRoute>
                <ForgotPasswordEmail />
            </PublicRoute>
        ),
    },
    {
        path: "/verify-forgot-otp/:id",
        element: (
            <PublicRoute>
                <ForgotPasswordOTP />
            </PublicRoute>
        ),
    },
    {
        path: "/reset-password/:id",
        element: (
            <PublicRoute>
                <ResetPassword />
            </PublicRoute>
        ),
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DefaultLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/profile/edit",
                element: <Edit />,
            },
            {
                path: "/create-post",
                element: <CreatePost />,
            },
            {
                path: "/post/:postId",
                element: <PostDetail />,
            },
            {
                path: "/explore",
                element: <ExplorePost />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);

export default router;
