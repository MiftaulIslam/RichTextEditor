import { X } from 'lucide-react'
import React, { useRef, useState } from 'react'

const PublishArticle = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [topics, setTopics] = useState<string[]|[]>(['React'])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [newTopic, setNewTopic] = useState('')
    const [showSchedule, setShowSchedule] = useState(false)
    const [scheduleTime, setScheduleTime] = useState('')
  
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  
    const handleRemoveImage = () => {
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  
    const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && newTopic.trim()) {
        setTopics([...topics, newTopic.trim()])
        setNewTopic('')
      }
    }
  
    const handleRemoveTopic = (topicToRemove: string) => {
      setTopics(topics.filter(topic => topic !== topicToRemove))
    }
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-semibold">Story Preview</h1>
          <div className="text-sm text-gray-600">
            Publishing to: <span className="font-medium">Miftaulislam</span>
          </div>
        </div>
  
        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="relative">
            {imagePreview ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Article preview"
                  className="object-fit"
                />
                <button
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
              className="w-full text-3xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Write a preview subtitle..."
              className="w-full text-xl text-gray-600 border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>
  
          {/* Topics Section */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Add or change topics (up to 5) so readers know what your story is about
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                >
                  {topic}
                  <button
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
                  onKeyDown={handleAddTopic}
                  placeholder="Add a topic..."
                  className="border-none bg-transparent focus:outline-none focus:ring-0 text-sm placeholder-gray-400"
                />
              )}
            </div>
          </div>
  
          {/* Note */}
          <p className="text-sm text-gray-500">
            Note: Changes here will affect how your story appears in public places like Medium's homepage and in subscribers' inboxes — not the contents of the story itself.
          </p>
  
          {/* Action Buttons */}
          <div className="space-y-4">
           
            
            {showSchedule ? (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Schedule a time to publish:</p>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <p className="text-sm text-gray-500">Dhaka time (GMT+6)</p>
                </div>
                
                <p className="text-sm text-gray-600">
                  This story will be published automatically within five minutes of the specified time.
                </p>
                
                <div className="flex gap-4">
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                    onClick={() => {
                      // Handle schedule submission
                      console.log('Scheduled for:', scheduleTime)
                      setShowSchedule(false)
                    }}
                  >
                    Schedule to publish
                  </button>
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => {
                      setShowSchedule(false)
                      setScheduleTime('')
                    }}
                  >
                    Cancel scheduling
                  </button>
                </div>
              </div>
            ):( <div className="flex gap-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                  Publish now
                </button>
                <button 
                  onClick={() => setShowSchedule(!showSchedule)} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Schedule for later
                </button>
              </div>)}
          </div>
        </div>
      </div>
  )
}

export default PublishArticle