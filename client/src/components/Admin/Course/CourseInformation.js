import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { styles } from "../../../styles/style";
import toast from "react-hot-toast";

const CourseInformation = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !courseInfo.name ||
      !courseInfo.description ||
      !courseInfo.price ||
      !courseInfo.tags ||
      !courseInfo.level ||
      !courseInfo.demoUrl ||
      !courseInfo.thumbnail
    ) {
      toast.error("Please fill in all required fields.")


    } else {
      setActive(active + 1);
    }

  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (file.size > maxSize) {
      toast.error('File size exceeds 10 MB');
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    const reader = new FileReader();
    if (file) {
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
    }
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full glass-panel p-6 800px:p-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
        {/* Course Name */}
        <div className="w-full">
          <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Course Name
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="Blockchain Fundamentals"
            value={courseInfo.name}
            className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
          />
        </div>

        {/* Course Description */}
        <div className="w-full">
          <label htmlFor="description" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Course Description
          </label>
          <textarea
            id="description"
            cols={30}
            rows={5}
            placeholder="Detailed course description..."
            className="w-full min-h-[120px] bg-black/20 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500 resize-y"
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>

        {/* Pricing Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label htmlFor="price" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Course Price ($)
            </label>
            <input
              type="number"
              id="price"
              required
              placeholder="29"
              value={courseInfo.price}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="estimatedPrice" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Estimated Price (optional)
            </label>
            <input
              type="number"
              id="estimatedPrice"
              required
              placeholder="49"
              value={courseInfo.estimatedPrice}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
            />
          </div>
        </div>

        {/* Course Tags */}
        <div className="w-full">
          <label htmlFor="tags" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Course Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            required
            placeholder="Blockchain, Crypto, Web3"
            value={courseInfo.tags}
            className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
          />
        </div>

        {/* Category and Level Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label htmlFor="category" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Course Category
            </label>
            <select
              id="category"
              required
              value={courseInfo.category}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, category: e.target.value })
              }
            >
              <option value="blockchain" className="bg-[#0B0F19]">Blockchain Courses</option>
              <option value="other" className="bg-[#0B0F19]">Other Courses</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Course Level
            </label>
            <input
              type="text"
              id="level"
              required
              placeholder="Beginner / Intermediate / Expert"
              value={courseInfo.level}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
            />
          </div>
        </div>

        {/* Demo URL Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label htmlFor="demoUrl" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Demo Video Url
            </label>
            <input
              type="text"
              id="demoUrl"
              required
              placeholder="https://youtube.com/..."
              value={courseInfo.demoUrl}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
            />
          </div>
        </div>

        {/* New Course Expansion Fields */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label htmlFor="duration" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Course Duration
            </label>
            <input
              type="text"
              id="duration"
              placeholder="e.g. 8 Weeks, 45 Hours"
              value={courseInfo.duration}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, duration: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="language" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Language
            </label>
            <input
              type="text"
              id="language"
              placeholder="English"
              value={courseInfo.language}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, language: e.target.value })
              }
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label htmlFor="syllabusUrl" className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Syllabus PDF URL (optional)
            </label>
            <input
              type="text"
              id="syllabusUrl"
              placeholder="https://drive.google.com/..."
              value={courseInfo.syllabusUrl}
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, syllabusUrl: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-4 h-full pt-4">
            <input
              type="checkbox"
              id="certificate"
              checked={courseInfo.certificate}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, certificate: e.target.checked })
              }
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="certificate" className="text-sm font-bold text-slate-300 cursor-pointer">
              Includes Certification upon Completion
            </label>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="w-full">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Course Thumbnail Cover
          </label>
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${dragging ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,242,254,0.3)]" : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt="Course Thumbnail"
                className="max-h-[250px] w-full object-contain p-2 rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 group">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-slate-600 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all group-hover:shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                  <FiUploadCloud size={30} className="text-slate-300 group-hover:text-primary transition-all" />
                </div>
                <span className="font-medium text-sm text-slate-300 group-hover:text-white transition-all">Click to browse or drag image here</span>
                <span className="text-xs text-slate-500 mt-2">JPEG, PNG, GIF (Max 10MB)</span>
              </div>
            )}
          </label>
        </div>

        {/* Form Action */}
        <div className="w-full flex items-center justify-end mt-4">
          <input
            type="submit"
            value="Next Step"
            className="w-full md:w-[200px] h-[50px] btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
