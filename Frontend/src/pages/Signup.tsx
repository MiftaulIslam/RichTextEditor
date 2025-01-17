
import BounceLoader from '@/Components/BounchLoader';
import Logo from '@/Components/Logo';
import { useHttp } from '@/hooks/useHttp';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12  px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4'>
              <div className="flex justify-center">
                <div
                  className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={handleImageClick}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

              </div>

              <p className="text-sm text-gray-500 mt-2">
                * Only <span className="font-medium text-gray-700">PNG, JPG, WEBP</span> formats are allowed.
                <br />
                * Maximum file size: <span className="font-medium text-gray-700">1MB</span>.
                <br />
                * Files exceeding the limit or unsupported formats will be rejected.
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  {...register('name', { required: 'Full Name is required' })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { required: 'Confirm Password is required' })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
