
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
    <div className="w-full glass-panel p-6 800px:p-10 block">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item, index) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;
          return (
            <>
              <div
                className={`w-full bg-white/5 border border-slate-600 rounded-xl p-6 shadow-inner ${
                  showSectionInput ? "mt-10" : "mb-4"
                }`}
              >
                {showSectionInput && (
                  <>
                    <div className="w-full flex items-center">
                      <input
                        type="text"
                        className={`text-xl font-bold ${
                          item.videoSection === "Untitled Section"
                            ? "w-[170px]"
                            : "w-min"
                        } cursor-pointer text-white bg-transparent outline-none border-b border-white/20 focus:border-primary transition-colors pb-1`}
                        value={item.videoSection}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoSection = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <BsPencil className="cursor-pointer text-slate-400 hover:text-white transition-colors ml-3" />
                    </div>
                  </>
                )}
                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    <>
                      {item.title ? (
                        <p className="font-bold text-white tracking-wide">
                          {index + 1}. {item.title}
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
                      className={` text-[20px] mr-2 ${
                        index > 0 ? "cursor-pointer text-danger hover:text-red-400" : "cursor-no-drop text-slate-600"
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
                      className="cursor-pointer text-slate-400 hover:text-white transition-colors"
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
                    <div className="my-4">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Video Title</label>
                      <input
                        className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
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
                    <div className="my-4">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Video Url</label>
                      <input
                        className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
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
                    <div className="my-4">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Video Description
                      </label>
                      <textarea
                        rows={6}
                        className="w-full min-h-[120px] bg-black/20 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500 resize-y"
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
                        <div className="w-full flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                            Link {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={` text-[20px] ${
                              linkIndex === 0
                                ? "cursor-no-drop text-slate-600"
                                : "cursor-pointer text-danger hover:text-red-400"
                            }`}
                            onClick={() =>
                              linkIndex === 0
                                ? null
                                : handleRemoveLink(index, linkIndex)
                            }
                          />
                        </div>
                        <input
                          className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500 mb-4"
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
                          className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
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
                        className="flex items-center text-sm font-bold text-primary cursor-pointer hover:text-white transition-colors mt-2"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="mr-2" /> Add Link
                      </p>
                    </div>
                  </>
                )}
                <br />
                {index === courseContentData.length - 1 && (
                  <div className="mt-4">
                    <p
                      className="btn-success"
                      onClick={() => newContentHandler(item)}
                    >
                      <AiOutlinePlusCircle size={16} /> Add New Content
                    </p>
                  </div>
                )}
              </div>
            </>
          );
        })}
        <br />
        <div
          className="mt-6 btn-action"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle size={16} /> Add New Section
        </div>
      </form>
      <br />
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-4">
        <div
          className="w-full md:w-[200px] h-[50px] btn-secondary"
          onClick={() => prevButton()}
        >
          Previous Step
        </div>
        <div
          className="w-full md:w-[200px] h-[50px] btn-primary"
          onClick={() => handleOptions()}
        >
          Next Step
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
