import BounceLoader from '@/Components/BounchLoader';
import Logo from '@/Components/Logo';
import { useHttp } from '@/hooks/useHttp';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data, loading, error, statusCode, sendRequest } = useHttp();


  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>();


  // 📝 Submit Form with Image
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!image) {
      alert('Please upload an image.');
      return;
    }
    // 🔧 Create FormData object
    const formDataObj = new FormData();
    formDataObj.append('name', name);
    formDataObj.append('email', email);
    formDataObj.append('password', password);

    // ✅ Include image file if uploaded

    formDataObj.append('avatar', image);


    // 🔥 Send FormData via your HTTP hook
    await sendRequest(`user/signup`, 'POST', formDataObj);
  };
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // ✅ Validate file type
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (file && !allowedTypes.includes(file.type)) {
      alert('Only PNG, JPG formats are allowed.');
      return;
    }

    // ✅ Validate file size (1MB limit)
    const maxSizeInMB = 1;
    if (file && file.size > maxSizeInMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeInMB}MB.`);
      return;
    }

    // ✅ If valid, generate preview and set image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }


  useEffect(() => {
    if(statusCode === 201 || statusCode === 200 && !error) {
      navigate('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error, statusCode])
  

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
                <h1 className="font-bold text-3xl text-gray-900 tracking-tight">Create your account</h1>
                <p className="mt-2 text-gray-600">Join our community today</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full w-24 h-24 transition-colors duration-200 cursor-pointer overflow-hidden"
                    onClick={handleImageClick}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p className="text-center text-gray-500 text-sm">
                    Click to upload profile picture
                  </p>
                </div>

                {/* Name Field */}
                <div>
                  <input
                    {...register('name', { required: 'Full Name is required' })}
                    placeholder="Full Name"
                    className="block bg-white/80 shadow-sm px-3 py-2.5 focus:border-none rounded-xl w-full transition-all duration-200 focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Invalid email address',
                      },
                    })}
                    placeholder="Email address"
                    className="block bg-white/80 shadow-sm px-3 py-2.5 focus:border-none rounded-xl w-full transition-all duration-200 focus:outline-none"
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                  <div>
                    <input
                      type="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      placeholder="Password"
                      className="block bg-white/80 shadow-sm px-3 py-2.5 focus:border-none rounded-xl w-full transition-all duration-200 focus:outline-none"
                    />
                    {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                  </div>

                  <div>
                    <input
                      type="password"
                      {...register('confirmPassword', { required: 'Please confirm your password' })}
                      placeholder="Confirm Password"
                      className="block bg-white/80 shadow-sm px-3 py-2.5 focus:border-none rounded-xl w-full transition-all duration-200 focus:outline-none"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="relative flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 hover:from-green-600 to-blue-500 hover:to-blue-600 hover:shadow-lg px-4 py-3 rounded-xl w-full font-semibold text-white transition-all duration-300 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Sign up
                </motion.button>
              </form>

              <p className="flex justify-center items-center mt-8 text-center text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="ml-2 text-green-600 hover:text-green-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
