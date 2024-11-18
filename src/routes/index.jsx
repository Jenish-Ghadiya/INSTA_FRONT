import { createBrowserRouter } from "react-router-dom";
import EmailVerification from '../components/auth/EmailVerification';
import OtpVerification from '../components/auth/OtpVerification';
import SignupForm from '../components/auth/SignupForm';
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordEmail from '../components/auth/forgtpassword/ForgotPasswordEmail';
import ForgotPasswordOTP from '../components/auth/forgtpassword/ForgotPasswordOTP';
import ResetPassword from '../components/auth/forgtpassword/ResetPassword';
import Home from '../components/home/index';
import DefaultLayout from "./defaultLayout/defaultlayout";
import Profile from "../components/profile";
import Edit from "../components/profile/edit";

const router = createBrowserRouter([
    {
        path: '/email-verification',
        element: <EmailVerification />,
    },
    {
        path: '/verify-otp/:id',
        element: <OtpVerification />,
    },
    {
        path: '/create-account/:id',
        element: <SignupForm />,
    },
    {
        path: '/login',
        element: <LoginForm />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordEmail />,
    },
    {
        path: '/verify-forgot-otp/:id',
        element: <ForgotPasswordOTP />,
    },
    {
        path: '/reset-password/:id',
        element: <ResetPassword />,
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/profile/edit',
                element: <Edit />,
            },
        ],
    },
    
    {
        path: '*',
        element: <h1>404 Error!</h1>,
    },
]);

export default router;