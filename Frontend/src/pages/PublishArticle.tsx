import BounceLoader from "@/Components/BounchLoader";
import { useHttp } from "@/hooks/useHttp";
import { useUserInfo } from "@/hooks/useUserInfo";
import useTokenStore from "@/store/TokenStore";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MultiSelect, type Option } from "@/Components/multi-select"
import { Label } from "@/Components/ui/label"

interface FormData {
  title: string;
  short_preview: string;
  tags: string[];
  publishAt?: string;
}
const PublishArticle = () => {
  
  const navigate = useNavigate()
    const userInfo = useUserInfo();
  const {articleId} = useParams();
  const { register, handleSubmit, control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title: "",
      short_preview: "",
      tags: [],
      publishAt: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const topics = watch("tags");
  const [availableTopics] = useState<Option[]>([
    { label: "Technology", value: "technology" },
    { label: "Programming", value: "programming" },
    { label: "Web Development", value: "web-development" },
    { label: "Cloud Computing", value: "cloud-computing" },
    { label: "DevOps", value: "devops" },
  ])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { loading, sendRequest, error } = useHttp();
  const token = useTokenStore((state) => state.token);
  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    // Append basic fields using forEach
    Object.keys(data).forEach((key) => {
      if (key === "tags") {
        // Tags array needs to be converted to a string
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key as keyof FormData]) {
        // For other fields, just append the value
        formData.append(key, data[key as keyof FormData] as string);
      }
    });

    if(!image) {
      toast("Article needs a thumbnail", {
        description: "Please add a thumbnail image for your article.",
      });
      return;
    }

    // If there's an image preview, convert it to a Blob and append
    if (image) {
      formData.append("thumbnail", image);
    }

    const headers = { Authorization: `Bearer ${token}` };
    const success = await sendRequest(`articles/p/${articleId}/e`, "PUT", formData, {headers});
    
    if(success) {
      toast("Article published successfully", {
        description: "Your article has been published successfully.",
      });
      navigate("/");
    } else {
      toast("Something went wrong", {
        description: error || "Please try again.",
      });
    }
  };
useEffect(() => {
  if (!token ) {
    toast("Unauthorize action detected", {
      description: "Please login to access this feature.",
      cancel: {
        label: "close",
        onClick: () => console.log("close"),
      },
    })
    navigate('/login')
    return;
  }
  else if(userInfo?.data.isActive == false){
    toast("Unauthorize action detected", {
      description: "Please verify your email to access this feature.",
      cancel: {
        label: "close",
        onClick: () => console.log("close"),
      },
    })
    navigate('/')
    return;
  }
}, [navigate, token, userInfo])

  const setTopics = (newTopics: string[]) => {
    setValue("tags", newTopics);
  };

  if(loading) return <BounceLoader/>

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-semibold text-xl">Story Preview</h1>
          <div className="text-gray-600 text-sm">
            Publishing by: <span className="font-medium">{userInfo?.data.name}</span>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="relative">
          {imagePreview ? (
            <div className="relative rounded-lg w-full overflow-hidden aspect-[16/9]">
              <img src={imagePreview} alt="Article preview" className="object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="top-4 right-4 absolute bg-white hover:bg-gray-100 shadow-lg p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col justify-center items-center border-2 border-gray-300 hover:bg-gray-50 border-dashed rounded-lg w-full cursor-pointer aspect-[16/9]">
              <div className="p-6 text-center">
                <p className="text-gray-600 text-sm">
                  Include a high-quality image in your story to make it more inviting to readers.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </label>
          )}
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Write a preview title..."
            {...register("title", { required: true })}
            className="border-none focus:ring-0 w-full font-bold text-3xl focus:outline-none placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Write a preview subtitle..."
            {...register("short_preview")}
            className="border-none focus:ring-0 w-full text-gray-600 text-xl focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* Topics Section */}
        <div className="space-y-2">
          <Label htmlFor="topics">Topics</Label>
          <MultiSelect
            options={availableTopics}
            selected={topics}
            onChange={setTopics}
            placeholder="Type to add topics..."
            allowCreation={true}
            onCreateOption={(input) => ({
              label: input,
              value: input.toLowerCase().replace(/\s+/g, "-")
            })}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {topics.length > 0 ? topics.join(", ") : "None"}
          </p>
        </div>

        {/* Schedule Section */}
        {showSchedule && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <p className="font-medium text-sm">Schedule a time to publish:</p>
              <Controller
                name="publishAt"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    {...field}
                    className="px-3 py-2 border rounded-md w-full"
                  />
                )}
              />
              <p className="text-gray-500 text-sm">Dhaka time (GMT+6)</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-4">
          <button
              type="button"
              className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-full text-white"
            >
              Preview Article
            </button>
            <button
            disabled={loading || !image}
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white disabled:opacity-50"
            >
              {showSchedule ? "Schedule to publish" : "Publish now"}
            </button>
            {!showSchedule ? (
              <button
                type="button"
                onClick={() => setShowSchedule(true)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Schedule for later
              </button>
            ):(
              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel Schedule 
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PublishArticle;
