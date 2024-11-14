import { createBrowserRouter } from "react-router-dom";
import EmailVerification from '../componets/auth/EmailVerification';
import OtpVerification from '../componets/auth/OtpVerification';
import SignupForm from '../componets/auth/SignupForm';
import LoginForm from "../componets/auth/LoginForm";
import ForgotPasswordEmail from '../componets/auth/forgtpassword/ForgotPasswordEmail';
import ForgotPasswordOTP from '../componets/auth/forgtpassword/ForgotPasswordOTP';
import ResetPassword from '../componets/auth/forgtpassword/ResetPassword';

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
        element: <h1>Home</h1>,
    },
    {
        path: '*',
        element: <h1>404 Error!</h1>,
    },
]);

export default router;