import BounceLoader from "@/Components/BounchLoader";
import { useHttp } from "@/hooks/useHttp";
import { IUser } from "@/Interfaces/EntityInterface";
import useTokenStore from "@/store/TokenStore";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";

interface FormData {
  title: string;
  short_preview: string;
  tags: string[];
  publishAt?: string;
}
const PublishArticle = () => {
  
  const { data: userInfo, isLoading } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: false,
  });
  const {articleId} = useParams();
  const { register, handleSubmit, control, reset, watch } = useForm<FormData>({
    defaultValues: {
      title: "",
      short_preview: "",
      tags: ["React"],
      publishAt: "",
    },
  });

  // const { fetchRequest } = useFetchQuery<articleResponse>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTopic, setNewTopic] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const topics = watch("tags");

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

  const handleAddTopic = () => {
    if (newTopic.trim() && topics.length < 5) {
      reset({ ...watch(), tags: [...topics, newTopic.trim()] });
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    reset({ ...watch(), tags: topics.filter((topic) => topic !== topicToRemove) });
  };

  const { loading, sendRequest } = useHttp();
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

  if(!image) alert("Article needs a thumbnail")
  // If there's an image preview, convert it to a Blob and append
  if (image) {
    formData.append("thumbnail", image); // You can dynamically generate file names if needed
  }

  const headers = { Authorization: `Bearer ${token}` };
  await sendRequest(`articles/p/${articleId}/e`, "PUT", formData, {headers});
    // await fetchRequest(`articles/p/${articleId}/e`, "PUT", formData, {headers})
  };

  if(loading||isLoading) return <BounceLoader/>

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
          <p className="text-gray-600 text-sm">
            Add or change topics (up to 5) so readers know what your story is about.
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(topic)}
                  className="ml-2 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {topics.length < 5 && (
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                placeholder="Add a topic..."
                className="bg-transparent border-none focus:ring-0 text-sm focus:outline-none placeholder-gray-400"
              />
            )}
          </div>
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
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white"
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
