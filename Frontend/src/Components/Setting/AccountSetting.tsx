
import ArrowRight from "@/widgets/Icons/ArrowRight"
import ReusableModal from "@/widgets/ReusableFormModal"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "motion/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import BounceLoader from "../BounchLoader"
import { useFetchQuery } from "@/hooks/useFetchQuery"
import useTokenStore from "@/store/TokenStore"
import { IUser } from "@/Interfaces/EntityInterface"

const AccountSetting = () => {

  const token = useTokenStore((state) => state.token);
  const { data: userInfo, isLoading: userLoading } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: false,
  });
  const [isProfileSettingModalOpen, setIsProfileSettingModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  // const [isCustomDomainModalOpen, setIsCustomDomainModalOpen] = useState(false)

  const profileRegisterMethods = useForm({
    defaultValues: {
      name: `${userInfo?.data.name}`,
      short_bio: `${userInfo?.data.short_bio}`
    }
  })
  const emailRegisterMethods = useForm({
    defaultValues: {
      email: `${userInfo?.data.email}`
    }
  })
  const queryClient = useQueryClient();
  const { fetchRequest } = useFetchQuery();

  const emailMutation = useMutation({
    mutationFn: async (email: unknown) => {

      const headers = { Authorization: `Bearer ${token}` };
      return await fetchRequest("user/update-email", "PUT", email, { headers });
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
      console.log("Email updated successfully");
      setIsEmailModalOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update email:", error);
    },
  });

  const profileSettingMutation = useMutation({
    mutationFn: async (data: unknown) => {

      const headers = { Authorization: `Bearer ${token}` };
      return await fetchRequest("user/update-info", "PUT", data, { headers });
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
      console.log("info updated successfully");
      setIsProfileSettingModalOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update email:", error);
    },
  });

  const imageMutation = useMutation({
    mutationFn: async (data: unknown) => {

      const headers = { Authorization: `Bearer ${token}` };
      return await fetchRequest("user/update-avatar", "PUT", data, { headers });
    },
    onSuccess: (updatedUser) => {

      queryClient.setQueryData(["user"], updatedUser);
      console.log("avatar updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update email:", error);
    },
  });

  const handleProfileSettingSubmit = (data: unknown) => {
    profileSettingMutation.mutate(data)
    console.log(data)
  }

  const handleEmailSubmit = (data: unknown) => {
    emailMutation.mutate(data)
    console.log(data)
  }
  const handleImageSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

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

    const formDataObj = new FormData();

    if (file) {
      formDataObj.append('avatar', file);
      imageMutation.mutate(formDataObj)
    }

  }
  const watchName = profileRegisterMethods.watch('name')
  const watchShortBio = profileRegisterMethods.watch('short_bio')

  if (userLoading || emailMutation.isPending || profileSettingMutation.isPending || imageMutation.isPending) return <BounceLoader />

  return (
    <div>
      <div className="space-y-8">
        <motion.div whileHover={{ scale: 1.01 }} className="cursor-pointer flex justify-between items-center"
          onClick={() => setIsEmailModalOpen(true)}>

          <h2 className="font-medium">Email address</h2>
          <div className="flex items-center gap-1">
            <p className="text-gray-600">{userInfo?.data.email}</p>
            <ArrowRight classname="w-4 h-4" />

          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="cursor-pointer flex justify-between items-center">

          <h2 className="font-medium">Domain</h2>
          <div className="flex items-center gap-1">
            <p className="text-gray-600">{userInfo?.data.domain}</p>
            <ArrowRight classname="w-4 h-4" />
          </div>

        </motion.div>

        <motion.div
          className="flex justify-between items-center cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={() => setIsProfileSettingModalOpen(true)}
        >
          <div>
            <h2 className="font-medium">Profile information</h2>
            <p className="text-gray-600">Edit your photo, name, pronouns, short bio, etc.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{userInfo?.data.name}</span>
            <img
              src={userInfo?.data.avatar || "/placeholder.svg"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            {/* arrow right */}
            <ArrowRight classname="w-4 h-4" />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.01 }}>

          <Link to={'/'} className="flex justify-between items-center">
            <div>
              <h2 className="font-medium">Profile design</h2>
              <p className="text-gray-600">Customize the appearance of your profile.</p>
            </div>
            <ArrowRight classname="w-4 h-4" />

          </Link>
        </motion.div>

        <div className="cursor-pointer flex justify-between items-center">
          <div>
            <h2 className="font-medium">Custom domain</h2>
            <p className="text-gray-600">
              Upgrade to a Medium Membership to redirect your profile URL to a domain like yourdomain.com.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">None</span>
            <ArrowRight classname="w-4 h-4" />

          </div>
        </div>


        <motion.div
          className="flex justify-between items-center cursor-pointer"
          whileHover={{ scale: 1.01 }}>
          <div>
            <h2 className="font-medium">Muted writers and publications</h2>
          </div>
          <ArrowRight classname="w-4 h-4" />

        </motion.div>

        <motion.div
          className="flex justify-between items-center cursor-pointer"
          whileHover={{ scale: 1.01 }}>
          <h2 className="font-medium">Blocked users</h2>
          <ArrowRight classname="w-4 h-4" />

        </motion.div>

        <div className="pt-8 border-t">
          <button className="text-red-500 hover:text-red-600">
            Deactivate account
          </button>
          <p className="text-gray-500 text-sm mt-1">
            Deactivating will suspend your account until you sign back in.
          </p>
        </div>
      </div>

      {/* Email Modal */}
      <ReusableModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        title="Profile information"
        methods={emailRegisterMethods}
      >
        <div className="space-y-6">

          <div>
            <label htmlFor="name" className="block mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...emailRegisterMethods.register('email', { required: true })}
              className="w-full p-2 border rounded bg-gray-50"
            />
          </div>

        </div>
      </ReusableModal>


      {/* Profile Setting Modal */}
      <ReusableModal
        isOpen={isProfileSettingModalOpen}
        onClose={() => setIsProfileSettingModalOpen(false)}
        onSubmit={handleProfileSettingSubmit}
        title="Profile information"
        methods={profileRegisterMethods}
      >
        <div className="space-y-6">

          {/* Image uploading */}
          <div>
            <label className="block mb-4">Photo</label>
            <div className="flex items-center gap-4">
              <img
                src={userInfo?.data.avatar || ''}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <button type="button" onClick={() => document.getElementById("file-input")?.click()} className="text-green-600 hover:text-green-700 mr-4">
                  Update
                </button>
                <button type="button" className="text-red-500 hover:text-red-600">
                  Remove
                </button>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleImageSubmit}
                  accept="image/*"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
                </p>
              </div>
            </div>
          </div>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...profileRegisterMethods.register('name', { required: true, maxLength: 50 })}
              className="w-full p-2 border rounded bg-gray-50"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {watchName.length}/50
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label htmlFor="shortBio" className="block mb-2">Short bio</label>
            <textarea
              id="shortBio"
              {...profileRegisterMethods.register('short_bio', { maxLength: 160 })}
              className="w-full p-2 border rounded bg-gray-50 h-24 resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {watchShortBio.length}/160
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <div>
              <h3 className="font-medium">About Page</h3>
              <p className="text-gray-600 text-sm">
                Personalize with images and more to paint more of a vivid portrait of yourself than your 'Short bio.'
              </p>
            </div>
            <ArrowRight classname="w-4 h-4" />
          </div>
        </div>
      </ReusableModal>
    </div>
  )
}

export default AccountSetting