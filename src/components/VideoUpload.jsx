import {
  Button,
  Card,
  Label,
  Progress,
  TextInput,
  Textarea,
  Alert,
} from "flowbite-react";
import videoLogo from "../assets/video-posting.png";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input
    setMeta((prev) => ({
      ...prev,
      [name]: value, // Update the property dynamically based on the name
    }));
  };

  const resetForm = () => {
    setMeta({
      title: "",
      description: "",
    });
    setSelectedFile(null);
    setUploading(false);
    // setMessage("");
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Select File !!");
      return;
    }
    saveVideoToServer(selectedFile, meta);
  };

  const saveVideoToServer = async (video, videoMetaData) => {
    setUploading(true);

    try {
      let formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", video);

      let response = await axios.post(
        `http://localhost:8080/api/v1/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart-form",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setProgress(progress);
          },
        }
      );
      setProgress(0);
      setMessage("File uploaded " + response.data.videoId);
      setUploading(false);
      toast.success("File uploaded successfully !!");
      resetForm();
    } catch (e) {
      console.error(e);
      setMessage("Error in uploading File");
      setUploading(false);
      toast.error("File not uploaded !!");
    }
  };

  return (
    <div className="text-white">
      <Card className="flex flex-col">
        <div>
          <h1>Upload Videos</h1>
          <form onSubmit={submitHandler} className="flex flex-col space-y-6">
            <div>
              <div className="mb-2 text-start">
                <Label htmlFor="file-upload" value="Video Title" />
              </div>
              <TextInput
                name="title" // Add name attribute
                value={meta.title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </div>

            <div className="max-w-md">
              <div className="mb-2 text-start">
                <Label htmlFor="comment" value="Video Description" />
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="write video description..."
                required
                rows={4}
                value={meta.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <img
                  className="h-16 w-16 object-cover"
                  src={videoLogo}
                  alt="Current profile photo"
                />
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  onChange={fileChangeHandler}
                  type="file"
                  className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
                />
              </label>
            </div>

            <div className="flex justify-center">
              {uploading && (
                <Progress
                  color="green"
                  progress={50}
                  size="lg"
                  labelProgress
                  labelText
                  textLabel="Uploading.."
                  style={{ width: "100%" }}
                />
              )}
            </div>

            <div>
              {message && (
                <Alert
                  color="success"
                  rounded
                  withBorderAccent
                  onDismiss={() => {
                    setMessage("");
                  }}
                >
                  <span className="font-medium">Success Alert!</span>
                  {message}
                </Alert>
              )}
            </div>

            <div className="flex justify-center">
              <Button disabled={uploading} type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default VideoUpload;
