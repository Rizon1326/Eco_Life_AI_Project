import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { Upload, ArrowUpCircle, CheckCircle, AlertCircle, Camera } from "lucide-react";

const ClassifyPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [webcamImage, setWebcamImage] = useState(null);
  const [inputType, setInputType] = useState("file");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".png, .jpg, .jpeg",
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  useEffect(() => {
    // Start webcam once the inputType is set to 'webcam'
    if (inputType === "webcam") {
      startWebcam();
    } else {
      // Reset if switching to file upload
      stopWebcam();
    }
  }, [inputType]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      setError("Error accessing webcam.");
      console.error(err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      // Ensure video and canvas are valid and accessible
      if (video.videoWidth && video.videoHeight) {
        // Set canvas width and height based on the video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame onto the canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Capture the image from canvas and set as webcam image
        const imageData = canvas.toDataURL("image/png");
        setWebcamImage(imageData);
      } else {
        setError("Error capturing image from webcam.");
      }
    }
  };

  const classifyWaste = async () => {
    if (inputType === "file" && !file) {
      setError("Please upload an image.");
      return;
    } else if (inputType === "webcam" && !webcamImage) {
      setError("Please capture an image from the webcam.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else if (webcamImage) {
      // Convert webcam image to blob and append it
      const imageBlob = dataURItoBlob(webcamImage);
      formData.append("file", imageBlob, "webcam_image.png");
    }

    try {
      const response = await axios.post("http://localhost:8000/classify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      setError("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  // Convert base64 data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Waste Classification
            </h1>
            <p className="text-xl text-gray-600">
              Choose an option to classify waste: upload an image or use the webcam.
            </p>
          </div>

          {/* Input Type Selection */}
          <div className="flex justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="file"
                name="inputType"
                checked={inputType === "file"}
                onChange={() => setInputType("file")}
              />
              <label htmlFor="file" className="text-lg text-gray-700">
                Upload Image
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="webcam"
                name="inputType"
                checked={inputType === "webcam"}
                onChange={() => setInputType("webcam")}
              />
              <label htmlFor="webcam" className="text-lg text-gray-700">
                Use Webcam
              </label>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* File Upload Section */}
            {inputType === "file" && (
              <div
                {...getRootProps()}
                className={`relative transition-all duration-300 ease-in-out
                  ${isDragging || isDragActive ? "scale-105 border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}
                  border-4 border-dashed rounded-xl p-12 text-center cursor-pointer
                  hover:border-blue-400 hover:bg-blue-50 group`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  <div className="space-y-2">
                    <p className="text-xl font-medium text-gray-700">
                      {isDragging ? "Drop your image here" : "Drag & Drop your image"}
                    </p>
                    <p className="text-sm text-gray-500">or click to browse (PNG, JPG, JPEG)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Webcam Section */}
            {inputType === "webcam" && (
              <div className="text-center">
                <button
                  onClick={startWebcam}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
                >
                  Start Webcam
                </button>
                <div className="relative mt-4">
                  <video ref={videoRef} className="w-full h-auto border-2 border-gray-300 rounded-lg" />
                  <button
                    onClick={captureImage}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full"
                  >
                    Capture Image
                  </button>
                </div>
                {webcamImage && (
                  <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800">Webcam Image Preview</h3>
                    <img
                      src={webcamImage}
                      alt="Captured Image"
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={classifyWaste}
                disabled={loading || (!file && !webcamImage)}
                className={`px-8 py-4 rounded-xl font-semibold text-white
                  transform transition-all duration-300 
                  ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"}
                  ${!(file || webcamImage) ? "opacity-50 cursor-not-allowed" : "opacity-100"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <ArrowUpCircle className="w-5 h-5" />
                    <span>Classify Waste</span>
                  </span>
                )}
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-xl p-8 shadow-lg space-y-6 transition-all duration-300 animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-900">
                  Classification Result
                </h3>

                {/* Waste Type */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-xl font-semibold text-gray-900">
                      {result.waste_type.type}
                    </span>
                  </div>
                  <p className="text-gray-700">{result.waste_type.description}</p>
                </div>

                {/* Analysis */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Detailed Analysis
                  </h4>
                  <div className="bg-gray-50 p-6 rounded-lg prose max-w-none">
                    <ReactMarkdown>{result.waste_type.waste_analysis}</ReactMarkdown>
                  </div>
                </div>

                {/* Classification Details */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Classification Details
                  </h4>
                  <div className="grid gap-4">
                    {result.details.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span className="font-medium text-gray-700">{detail.label}</span>
                        <span className="font-mono text-blue-600">
                          {(detail.score * 100).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;
