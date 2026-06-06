import React, { useState, useEffect } from "react";
import Image from "../carouselimages/blogsectionBanner.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer.js";
import Heading from "../components/Heading.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../redux/features/blogSlice";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BlogPage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  // Calculate pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs?.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil((blogs?.length || 0) / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Heading 
        title="Blogs | Kairaa Blockchain Academy"
        description="Explore the latest insights, tips, and updates on blockchain, crypto, and Web3 from the Kairaa Blockchain Academy blog. Stay informed and inspired."
        keywords="Blockchain blog, Web3 news, Crypto articles, Kairaa Blockchain insights, Blockchain education, Tech blog, Web3 trends" 
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <div
        style={{
          backgroundImage: `url(${Image})`,
          width: "100%",
          height: "250px",
          objectFit: "cover",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
        className="relative"
      >
        <h2 className="font-bold absolute top-1/3 left-12 mx-auto md:text-[40px] text-2xl font-headingFont">
          Kairaa Blockchain Academy's Blog
        </h2>
      </div>
      <div className="my-12">
        <div className="m-8 items-center justify-center">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : blogs?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blogs available at the moment.</p>
            </div>
          ) : (
            <>
              {currentBlogs?.map((blog) => (
                <div
                  className="border-2 flex md:w-4/6 w-full h-64 m-auto md:mt-24 mt-12"
                  key={blog._id}
                >
                  <div className="w-2/5">
                    <img
                      src={blog.Image?.url}
                      alt={blog.title}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="md:p-8 p-2 w-3/5">
                    <h2 className="font-bold font-headingFont md:text-xl text-lg my-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="md:text-lg text-md line-clamp-3">{blog.content}</p>
                    <button 
                      onClick={() => handleReadMore(blog)}
                      className="mt-4 text-xl p-4 rounded-md underline text-[#1c2a59] font-paraFont font-bold inline-block"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-200 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-200 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Blog Modal */}
      {isModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 mt-20">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold font-headingFont pr-4 text-gray-800">{selectedBlog.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              {selectedBlog.Image?.url && (
                <div className="mb-6">
                  <img
                    src={selectedBlog.Image.url}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedBlog.content}
                </p>
              </div>
              <div className="mt-6 text-sm text-gray-500 border-t pt-4">
                Published on {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default BlogPage;
