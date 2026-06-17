import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiTag,
  FiArrowRight,
} from "react-icons/fi";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="w-full aspect-[16/10] overflow-hidden bg-[#e4e6eb]">
          {blog.image?.url ? (
            <img
              src={blog.image.url}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <span className="text-5xl">📰</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          {blog.category && (
            <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md">
              {blog.category}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
          {blog.createdAt && (
            <span className="flex items-center gap-1">
              <FiCalendar size={12} />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}

          {blog.tags && (
            <span className="flex items-center gap-1">
              <FiTag size={12} />
              {blog.tags}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold leading-snug text-neutral-900 mb-3 line-clamp-2 font-headingFont transition-colors duration-300 group-hover:text-primary-600">
          {blog.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-neutral-500 leading-relaxed mb-5 flex-1 line-clamp-3">
          {blog.description}
        </p>

        {/* Read More */}
        <div className="mt-auto pt-4 border-t border-neutral-100">
          <button className="flex items-center gap-2 text-primary-600 text-sm font-semibold group/btn">
            Read More
            <FiArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;