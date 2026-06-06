import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useUploadGalleryImageMutation } from "../../redux/features/gallery/galleryApi.js";
import { styles } from "../../styles/style.js";
import { useNavigate } from "react-router-dom";
const CreateGalleryImage = () => {
  const [dragging, setDragging] = useState(false);

const navigate=useNavigate();
  const [UploadGalleryImagePage, {isSuccess, error}]=useUploadGalleryImageMutation()
  const [ImageInfo, setImageInfo] = useState({
  name:"",
    description: "",
    tags: "",
    image: "",
  });


const handleSubmit=async(e)=>{
    e.preventDefault();

const data=ImageInfo;

await UploadGalleryImagePage(data)
}

  useEffect(() => {
    if (isSuccess) {
      toast.success("Image upadted successfully!");
      navigate("/admin/edit-gallery-image")
    }



    if (error) {
      if ("data" in error) {
        const errorMessage = error;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    // setImageInfo(file)
    // console.log()
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (file.size > maxSize) {
      toast.error("File size exceeds 10 MB");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImageInfo({ ...ImageInfo, image: reader.result });
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
        setImageInfo({ ...ImageInfo, image: reader.result });
      };
    }
    reader.readAsDataURL(file);
  };
  return (
    <div className="800px:w-[80%] w-[70%] ml-[10px] 800px:mx-auto my-auto ">
      <h2 className="font-bold py-4 text-xl">Upload Gallery Image</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Image Name
          </label>
          <input
            type="text"
            id="name"
            required
            name=""
            placeholder="Enter Image Name"
            value={ImageInfo.name}
            className={`${styles.input}`}
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, name: e.target.value })
            }
          />
        </div>
        <br />

        <div className="">
          <label htmlFor="desc" className={`${styles.label}`}>
            Image Description
          </label>
          <textarea
            name=""
            id="desc"
            cols={30}
            rows={8}
            placeholder="Course description"
            className={`${styles.input} !h-min-24 py-2 `}
            value={ImageInfo.description}
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />

        <div>
          <label htmlFor="tags" className={`${styles.label}`}>
            Image Tags
          </label>
          <input
            type="text"
            id="tags"
            required
            name=""
            placeholder="Blockchain Seminar / Event"
            value={ImageInfo.tags}
            className={`${styles.input}`}
            onChange={(e) =>
              setImageInfo({ ...ImageInfo, tags: e.target.value })
            }
          />
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
            // onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            // onDrop={handleDrop}
          >
            {ImageInfo.image ? (
              <img
                src={ImageInfo.image}
                alt=""
                className="max-h-[200px] w-full object-cover"
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
            value="Upload Image"
            className="w-full 800px:w-[180px] h-[40px] font-bold bg-blue-500 text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateGalleryImage;
