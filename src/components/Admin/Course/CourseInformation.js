import React, { useState } from "react";
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
     
      
    }else{
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
    <div className="800px:w-[80%] w-[70%] ml-[10px] 800px:mx-auto my-auto mt-24 ">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="" className={`${styles.label}`}>
            Course Name
          </label>
          <input
            type="text"
            id="name"
            required
            name=""
            placeholder="Blockchain Fundamentals"
            value={courseInfo.name}
            className={`${styles.input}`}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
          />
        </div>
        <br />
        <div className="">
          <label htmlFor="" className={`${styles.label}`}>
            Course Description
          </label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Course description"
            className={`${styles.input} !h-min-24 py-2 `}
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Course Price
            </label>
            <input
              type="number"
              id=""
              required
              name=""
              placeholder="29"
              value={courseInfo.price}
              className={`${styles.input}`}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              id=""
              required
              name=""
              placeholder="29"
              value={courseInfo.estimatedPrice}
              className={`${styles.input}`}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        <div>
          <label htmlFor="" className={`${styles.label}`}>
            Course Tags
          </label>
          <input
            type="text"
            id="name"
            required
            name=""
            placeholder="Blockchain"
            value={courseInfo.tags}
            className={`${styles.input}`}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
          />
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Course Level
            </label>
            <input
              type="text"
              id=""
              required
              name=""
              placeholder="Begineer/Intermediate/Expert"
              value={courseInfo.level}
              className={`${styles.input}`}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Demo Url
            </label>
            <input
              type="text"
              id=""
              required
              name=""
              placeholder=""
              value={courseInfo.demoUrl}
              className={`${styles.input}`}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        <div className="w-full ">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh]  border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="mx-h-full w-full object-cover"
              />
            ) : (
              <span>Choose a file or drag it here.</span>
            )}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-blue-500 text-center text-[#fff] rounded mt-8 cursor-pointer"
           
              
            
          />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;
