
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { styles } from "../../../styles/style";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import toast from "react-hot-toast";

const CourseContent = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCollapseToggle = (index) => {
    setIsCollapsed((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  const handleRemoveLink = (index, linkIndex) => {
    setCourseContentData((prevState) => {
      const updatedData = prevState.map((item, i) => {
        if (i === index) {
          const updatedLinks = item.links.filter((_, li) => li !== linkIndex);
          return { ...item, links: updatedLinks };
        }
        return item;
      });
      return updatedData;
    });
  };

  const handleAddLink = (index) => {
    setCourseContentData((prevState) => {
      const updatedData = prevState.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            links: [...item.links, { title: "", url: "" }],
          };
        }
        return item;
      });
      return updatedData;
    });
  };

  const newContentHandler = (item) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error("Please fill all the fields");
    } else {
      let newVideoSection = "";
      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill all the fields");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: `Untitled Section ${activeSection}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      !courseContentData ||
      !courseContentData.length > 0 ||
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Section can't be empty");
    } else {
      setActive(active + 1);
      handleCourseSubmit();
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item, index) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;
          return (
            <>
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${
                  showSectionInput ? "mt-10" : "mb-0"
                }  `}
              >
                {showSectionInput && (
                  <>
                    <div className="w-full flex items-center">
                      <input
                        type="text"
                        className={`text-[20px] ${
                          item.videoSection === "Untitled Section"
                            ? "w-[170px]"
                            : "w-min"
                        } font-poppins cursor-pointer  text-black bg-transparent outline-none border-b-2`}
                        value={item.videoSection}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoSection = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <BsPencil className="cursor-pointer  text-black" />
                    </div>
                  </>
                )}
                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    <>
                      {item.title ? (
                        <p className="font-poppins  text-black">
                          {index + 1}.{item.title}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={` text-[20px] mr-2 text-black ${
                        index > 0 ? "cursor-pointer" : "cursor-no-drop"
                      }`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = courseContentData.filter(
                            (_, i) => i !== index
                          );
                          setCourseContentData(updatedData);
                        }
                      }}
                    />
                    <MdOutlineKeyboardArrowDown
                      fontSize="large"
                      className=" text-black"
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      onClick={() => handleCollapseToggle(index)}
                    />
                  </div>
                </div>
                {!isCollapsed[index] && (
                  <>
                    <div className="my-3">
                      <label className={`${styles.label}`}>Video Title</label>
                      <input
                        className={`${styles.input}`}
                        type="text"
                        placeholder="Project plan...."
                        value={item.title}
                        onChange={(e) => {
                          const updatedData = courseContentData.map(
                            (content, i) =>
                              i === index
                                ? { ...content, title: e.target.value }
                                : content
                          );
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={`${styles.label}`}>Video Url</label>
                      <input
                        className={`${styles.input}`}
                        type="text"
                        placeholder="enter video url"
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedData = courseContentData.map(
                            (content, i) =>
                              i === index
                                ? { ...content, videoUrl: e.target.value }
                                : content
                          );
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={`${styles.label}`}>
                        Video Description
                      </label>
                      <textarea
                        rows={8}
                        cols={30}
                        className={`${styles.input} py-2`}
                        placeholder="video description...."
                        value={item.description}
                        onChange={(e) => {
                          const updatedData = courseContentData.map(
                            (content, i) =>
                              i === index
                                ? { ...content, description: e.target.value }
                                : content
                          );
                          setCourseContentData(updatedData);
                        }}
                      />
                      <br />
                    </div>
                    {item?.links.map((link, linkIndex) => (
                      <div className="mb-3 block" key={linkIndex}>
                        <div className="w-full flex items-center justify-between">
                          <label className={styles.label}>
                            Link {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={` text-[20px] text-black ${
                              linkIndex === 0
                                ? "cursor-no-drop"
                                : "cursor-pointer"
                            }`}
                            onClick={() =>
                              linkIndex === 0
                                ? null
                                : handleRemoveLink(index, linkIndex)
                            }
                          />
                        </div>
                        <input
                          className={`${styles.input}`}
                          type="text"
                          placeholder="Link title...."
                          value={link.title}
                          onChange={(e) => {
                            const updatedData = courseContentData.map(
                              (content, i) =>
                                i === index
                                  ? {
                                      ...content,
                                      links: content.links.map(
                                        (l, li) =>
                                          li === linkIndex
                                            ? { ...l, title: e.target.value }
                                            : l
                                      ),
                                    }
                                  : content
                            );
                            setCourseContentData(updatedData);
                          }}
                        />
                        <input
                          className={`${styles.input} mt-6`}
                          type="text"
                          placeholder="Link url...."
                          value={link.url}
                          onChange={(e) => {
                            const updatedData = courseContentData.map(
                              (content, i) =>
                                i === index
                                  ? {
                                      ...content,
                                      links: content.links.map(
                                        (l, li) =>
                                          li === linkIndex
                                            ? { ...l, url: e.target.value }
                                            : l
                                      ),
                                    }
                                  : content
                            );
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                    ))}
                    <br />
                    <div className="inline-block mb-4">
                      <p
                        className="flex items-center text-[18px]  text-black cursor-pointer"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="mr-2" /> Add Link
                      </p>
                    </div>
                  </>
                )}
                <br />
                {index === courseContentData.length - 1 && (
                  <div>
                    <p
                      className="flex items-center text-[18px]  text-black cursor-pointer"
                      onClick={() => newContentHandler(item)}
                    >
                      <AiOutlinePlusCircle className="mr-2" />
                      Add New Content
                    </p>
                  </div>
                )}
              </div>
            </>
          );
        })}
        <br />
        <div
          className="flex items-center text-[20px]  text-black cursor-pointer"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" />
          Add New Section
        </div>
      </form>
      <br />
      <div className="w-full flex items-center justify-between gap-12 mb-24">
        <div
          className="w-full 800px:w-[180px] h-[40px] bg-blue-500 flex items-center justify-center text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          prev
        </div>
        <div
          className="w-full 800px:w-[180px] h-[40px] bg-blue-500 flex items-center justify-center text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
