import BounceLoader from '@/Components/BounchLoader';
import Logo from '@/Components/Logo';
import { useHttp } from '@/hooks/useHttp';
import { ILoginResponse } from '@/Interfaces/ResponseInterface';
import useTokenStore from '@/store/TokenStore';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';

// Add InputWrapper component definition
const InputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
        {children}
    </div>
);

// Define the form inputs type
interface LoginFormInputs {
    email: string;
    password: string;
}

// Update Logo component props interface
interface LogoProps {
    size: {
        dev_text: number;
        talks_text: number;
    };
    unit: string;
}

export default function Login() {
    const token = useTokenStore((state) => state.token);

    const navigate = useNavigate();
    const { setToken } = useTokenStore();
    const { data, error, statusCode, loading, sendRequest } = useHttp<ILoginResponse>();
    // Initialize useForm hook
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    // Handle form submission
    const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {

        await sendRequest(`user/login`, "POST", formData);

    };
    useEffect(() => {
        if (token) { navigate('/') }
        if (statusCode === 200 && !error && data) {
            setToken(data?.token)

            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, loading, error, statusCode, token])

    if (loading) return <BounceLoader />



    return (
        <div className="flex bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
            <div className="flex flex-col flex-1 justify-center items-center px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 w-full max-w-md">
                    <div className="flex justify-center items-center">
                        <Logo size={{ dev_text: 3, talks_text: 3 }} unit="rem" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Card Background Layers for Depth */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-300 to-blue-300 opacity-20 group-hover:opacity-30 blur-xl rounded-2xl transition duration-1000 group-hover:duration-200" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 opacity-10 group-hover:opacity-20 blur-xl rounded-2xl transition duration-1000 group-hover:duration-200" />

                        {/* Main Card */}
                        <div className="relative border-gray-200/50 bg-white/90 shadow-xl backdrop-blur-sm p-8 border rounded-2xl overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="top-0 right-0 absolute bg-green-100 opacity-60 blur-2xl -mt-4 -mr-4 rounded-full w-24 h-24" />
                            <div className="bottom-0 left-0 absolute bg-blue-100 opacity-60 blur-2xl -mb-4 -ml-4 rounded-full w-24 h-24" />

                            <div className="relative z-10 mb-8 text-center">
                                <h1 className="font-bold text-3xl text-gray-900 tracking-tight">Welcome back</h1>
                                <p className="mt-2 text-gray-600">Sign in to your account</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <InputWrapper>
                                    <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                        <Mail size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        type="email"
                                        placeholder="Email"
                                        className="block border-gray-300 focus:border-green-500 bg-white/80 shadow-sm py-2.5 pr-3 pl-10 rounded-xl focus:ring-2 focus:ring-green-200 w-full transition-all duration-200"
                                    />
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.span
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-1 text-red-500 text-sm"
                                            >
                                                {errors.email.message}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </InputWrapper>

                                <InputWrapper>
                                    <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                        <Lock size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        {...register("password", {
                                            required: "Password is required"
                                        })}
                                        type="password"
                                        placeholder="Password"
                                        className="block border-gray-300 focus:border-green-500 bg-white/80 shadow-sm py-2.5 pr-3 pl-10 rounded-xl focus:ring-2 focus:ring-green-200 w-full transition-all duration-200"
                                    />
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.span
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-1 text-red-500 text-sm"
                                            >
                                                {errors.password.message}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </InputWrapper>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="border-gray-300 rounded focus:ring-green-200 text-green-500 transition-all duration-200"
                                        />
                                        <label className="ml-2 text-gray-600 text-sm">Remember me</label>
                                    </div>
                                    <Link to="/forgot-password" className="font-medium text-green-600 text-sm hover:text-green-700">
                                        Forgot password?
                                    </Link>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    className="relative flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 hover:from-green-600 to-blue-500 hover:to-blue-600 hover:shadow-lg px-4 py-3 rounded-xl w-full font-semibold text-white transition-all duration-300 overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    Sign in
                                </motion.button>
                            </form>

                            <p className="flex justify-center items-center mt-8 text-center text-gray-500 text-sm">
                                Need an account?
                                <Link
                                    to="/signup"
                                    className={`block px-2 py-2 text-sm text-gray-600 hover:underline`}
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
