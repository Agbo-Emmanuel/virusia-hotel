import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { createRoom } from "../../services/room.service";
import {
  FaBed,
  FaCloudUploadAlt,
  FaTrash,
  FaCheck,
  FaHashtag,
  FaUsers,
  FaArrowLeft,
  FaLayerGroup,
  FaImage,
  FaSpinner,
  FaMoneyBillWave,
  FaClock,
  FaMoon,
  FaCode,
  FaEye,
} from "react-icons/fa";

const ROOM_TYPES = [
  { value: "standard", label: "Standard Room" },
  // { value: "deluxe", label: "Deluxe Suite" },
  // { value: "executive", label: "Executive Suite" },
  // { value: "presidential", label: "Presidential Suite" },
  // { value: "penthouse", label: "Penthouse Suite" },
];

const CreateRoom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "standard",
    pricePerHour: "",
    pricePerNight: "",
    numberOfGuest: 2,
  });

  // Selected file objects to be uploaded to Cloudinary on submit
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Preview object URLs for selected files
  const [filePreviews, setFilePreviews] = useState([]);

  // Existing / Direct Image URLs (if any manually added or pre-populated)
  const [imageUrls, setImageUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter valid image files
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    if (validImages.length < files.length) {
      toast.warning("Some non-image files were skipped.");
    }

    if (validImages.length === 0) return;

    // Create preview URLs
    const newPreviews = validImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setSelectedFiles((prev) => [...prev, ...validImages]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove Selected File Preview
  const handleRemoveFilePreview = (id, index) => {
    // Revoke object URL to prevent memory leaks
    if (filePreviews[index]?.url) {
      URL.revokeObjectURL(filePreviews[index].url);
    }
    setFilePreviews((prev) => prev.filter((item) => item.id !== id));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Direct Image URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput); // basic URL validation
      setImageUrls((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
      toast.info("Image URL added to gallery");
    } catch {
      toast.error("Please enter a valid URL address");
    }
  };

  // Remove Image URL
  const handleRemoveUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Total images count (files + direct URLs)
  const totalImagesCount = selectedFiles.length + imageUrls.length;

  // Construct current payload object representation for preview
  const currentPayloadPreview = {
    roomNumber: formData.roomNumber || "001",
    roomType: formData.roomType,
    pricePerHour: Number(formData.pricePerHour) || 0,
    pricePerNight: Number(formData.pricePerNight) || 0,
    numberOfGuest: Number(formData.numberOfGuest) || 1,
    images: [
      ...imageUrls,
      ...filePreviews.map((p, i) => `[Cloudinary Upload Queue #${i + 1}]`),
    ],
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validations
    if (!formData.roomNumber.trim()) {
      toast.error("Please provide a Room Number");
      return;
    }
    if (!formData.roomType) {
      toast.error("Please select a Room Type");
      return;
    }
    if (!formData.pricePerHour || Number(formData.pricePerHour) <= 0) {
      toast.error("Please enter a valid Price Per Hour");
      return;
    }
    if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
      toast.error("Please enter a valid Price Per Night");
      return;
    }
    if (!formData.numberOfGuest || Number(formData.numberOfGuest) < 1) {
      toast.error("Number of guests must be at least 1");
      return;
    }

    if (totalImagesCount === 0) {
      toast.error("Please select or add at least one room image");
      return;
    }

    setIsSubmitting(true);
    let finalCloudinaryUrls = [];

    try {
      // 2. Upload images to Cloudinary if local files are selected
      if (selectedFiles.length > 0) {
        setUploadProgress(
          `Uploading ${selectedFiles.length} image(s) to Cloudinary...`,
        );
        const toastId = toast.loading(
          `Uploading ${selectedFiles.length} image(s) to Cloudinary...`,
        );

        try {
          // Concurrent Cloudinary uploads using Promise.all
          const uploadPromises = selectedFiles.map((file) =>
            uploadImageToCloudinary(file),
          );
          finalCloudinaryUrls = await Promise.all(uploadPromises);

          toast.update(toastId, {
            render: "Cloudinary upload completed successfully!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } catch (uploadError) {
          toast.update(toastId, {
            render: `Cloudinary upload failed: ${uploadError.message || "Unknown error"}`,
            type: "error",
            isLoading: false,
            autoClose: 4000,
          });
          throw uploadError;
        }
      }

      // Combine direct URLs and newly uploaded Cloudinary URLs
      const allImages = [...imageUrls, ...finalCloudinaryUrls];

      // 3. Prepare Final req.body Payload
      const payload = {
        roomNumber: formData.roomNumber.trim(),
        roomType: formData.roomType,
        pricePerHour: Number(formData.pricePerHour),
        pricePerNight: Number(formData.pricePerNight),
        numberOfGuest: Number(formData.numberOfGuest),
        images: allImages,
      };

      setUploadProgress("Saving room entry to server...");

      // 4. Send API request to create room
      const res = await createRoom(payload);

      toast.success(
        res?.message || `Room ${payload.roomNumber} created successfully!`,
      );

      // Reset Form State
      setFormData({
        roomNumber: "",
        roomType: "standard",
        pricePerHour: "",
        pricePerNight: "",
        numberOfGuest: 2,
      });
      setSelectedFiles([]);
      setFilePreviews([]);
      setImageUrls([]);

      // Optional redirect back to room list after short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error("Error creating room:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to create room";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-amber-600 mb-2 transition cursor-pointer"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xl">
              <FaBed />
            </span>
            Create New Room Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure room attributes, rates per hour/night, and upload gallery
            imagery directly to Cloudinary.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: Form Inputs (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Room Identification & Details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaHashtag className="text-amber-600 text-sm" />
              <h2 className="font-serif font-extrabold text-slate-900 text-base">
                Basic Specifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Room Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Room Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    #
                  </span>
                  <input
                    type="text"
                    name="roomNumber"
                    required
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="e.g. 002"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Room Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition capitalize appearance-none cursor-pointer"
                  >
                    {ROOM_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} ({type.value})
                      </option>
                    ))}
                  </select>
                  <FaLayerGroup className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maximum Guest Capacity <span className="text-rose-500">*</span>
              </label>
              <div className="relative max-w-xs">
                <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="number"
                  name="numberOfGuest"
                  min="1"
                  max="20"
                  required
                  value={formData.numberOfGuest}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing Structure */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaMoneyBillWave className="text-amber-600 text-sm" />
              <h2 className="font-serif font-extrabold text-slate-900 text-base">
                Pricing Strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Per Hour */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price Per Hour <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 text-xs" />
                  <input
                    type="number"
                    name="pricePerHour"
                    min="0"
                    step="1"
                    required
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="e.g. 3000"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Short-stay hourly rate tier
                </p>
              </div>

              {/* Price Per Night */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price Per Night <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaMoon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600 text-xs" />
                  <input
                    type="number"
                    name="pricePerNight"
                    min="0"
                    step="1"
                    required
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    placeholder="e.g. 10000"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Full overnight booking rate tier
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Cloudinary Image Uploader & Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FaImage className="text-amber-600 text-sm" />
                <h2 className="font-serif font-extrabold text-slate-900 text-base">
                  Room Images Gallery
                </h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200/60">
                {totalImagesCount} Image{totalImagesCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Drag & Drop File Select Area */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 bg-slate-50/50 hover:bg-amber-500/5 transition text-center group cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition">
                  <FaCloudUploadAlt />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Click or drag images to select files for Cloudinary upload
                </p>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, WEBP formats supported. High resolution recommended.
                </p>
              </div>
            </div>

            {/* Optional Direct URL Input */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Or Add Image by Direct URL
              </span>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Selected File Previews Grid */}
            {(filePreviews.length > 0 || imageUrls.length > 0) && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700">
                  Selected Gallery Queue:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* File Previews (To be uploaded to Cloudinary) */}
                  {filePreviews.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-xs"
                    >
                      <img
                        src={item.url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveFilePreview(item.id, idx)}
                          className="p-1.5 bg-rose-600 text-white rounded-lg text-xs hover:bg-rose-700 transition cursor-pointer"
                          title="Remove image"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <span className="absolute top-1 left-1 bg-amber-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        Cloudinary Queue
                      </span>
                    </div>
                  ))}

                  {/* Direct Image URLs */}
                  {imageUrls.map((url, idx) => (
                    <div
                      key={`url-${idx}`}
                      className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-xs"
                    >
                      <img
                        src={url}
                        alt={`URL ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveUrl(idx)}
                          className="p-1.5 bg-rose-600 text-white rounded-lg text-xs hover:bg-rose-700 transition cursor-pointer"
                          title="Remove image URL"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <span className="absolute top-1 left-1 bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        URL Direct
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-2xl text-xs shadow-lg shadow-amber-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>{uploadProgress || "Processing..."}</span>
                </>
              ) : (
                <>
                  <FaCheck className="text-sm" />
                  <span>Create Room Listing</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Section: Live Preview & Payload JSON Display (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          {/* Card Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaEye className="text-amber-600 text-sm" />
              <h2 className="font-serif font-extrabold text-slate-900 text-base">
                Live Room Card Preview
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
              {/* Top Image Preview */}
              <div className="relative h-44 bg-slate-200 overflow-hidden">
                {filePreviews.length > 0 || imageUrls.length > 0 ? (
                  <img
                    src={filePreviews[0]?.url || imageUrls[0]}
                    alt="Room Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <FaImage className="text-3xl" />
                    <span className="text-xs font-semibold">
                      No Image Selected
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {formData.roomType || "Standard"}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Available
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-extrabold text-slate-900 text-base">
                      Room #{formData.roomNumber || "002"}
                    </h3>
                    <p className="text-xs text-slate-400 capitalize">
                      {formData.roomType || "standard"} suite
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-extrabold text-amber-600 text-base">
                      ₦{Number(formData.pricePerNight || 0).toLocaleString()}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">
                      per night
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5">
                    <FaClock className="text-amber-600 text-xs" />
                    <span>
                      ₦{Number(formData.pricePerHour || 0).toLocaleString()}/hr
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaUsers className="text-amber-600 text-xs" />
                    <span>{formData.numberOfGuest || 2} Guests max</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* JSON req.body Payload Viewer */}
          {/* <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-slate-200 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FaCode className="text-amber-400 text-sm" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                  req.body Payload Preview
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                POST /api/rooms
              </span>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar">
              {JSON.stringify(currentPayloadPreview, null, 2)}
            </pre>

            <p className="text-[11px] text-slate-400 leading-normal">
              When submitted, images queued for Cloudinary will be uploaded
              asynchronously first, and their generated CDN secure URLs will
              populate the <code className="text-amber-300">images</code> array
              payload sent to the backend.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
