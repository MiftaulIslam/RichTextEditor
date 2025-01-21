import BounceLoader from "@/Components/BounchLoader";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useHttp } from "@/hooks/useHttp";
import { IUser } from "@/Interfaces/AuthInterfaces";
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
interface article{
  id:string;
  author_id:string;
  title:string;
  content:string;
  created_at:string;
  is_published:boolean;
  publishedAt: string|null;
  slug:string;
  thumbnail:string|null;
  updated_at:string;
  views:number;
}
interface articleResponse {
message:string;
statusCode:number;
success:boolean;
data: article;
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
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-semibold">Story Preview</h1>
          <div className="text-sm text-gray-600">
            Publishing by: <span className="font-medium">{userInfo?.data.name}</span>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="relative">
          {imagePreview ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <img src={imagePreview} alt="Article preview" className="object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="text-center p-6">
                <p className="text-sm text-gray-600">
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
            className="w-full text-3xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Write a preview subtitle..."
            {...register("short_preview")}
            className="w-full text-xl text-gray-600 border-none focus:outline-none focus:ring-0 placeholder-gray-400"
          />
        </div>

        {/* Topics Section */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Add or change topics (up to 5) so readers know what your story is about.
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
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
                className="border-none bg-transparent focus:outline-none focus:ring-0 text-sm placeholder-gray-400"
              />
            )}
          </div>
        </div>

        {/* Schedule Section */}
        {showSchedule && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <p className="text-sm font-medium">Schedule a time to publish:</p>
              <Controller
                name="publishAt"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    {...field}
                    className="w-full border rounded-md px-3 py-2"
                  />
                )}
              />
              <p className="text-sm text-gray-500">Dhaka time (GMT+6)</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
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
