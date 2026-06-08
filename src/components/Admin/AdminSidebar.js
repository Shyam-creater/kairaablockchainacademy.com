import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Icon, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import {
  HomeOutlinedIcon,
  ExitToAppIcon,
  SettingsIcon,
  ManageHistoryIcon,
  WysiwygIcon,
  QuizIcon,
  WebIcon,
  VideoCallIcon,
  OndemandVideoIcon,
  GroupsIcon,
  MapOutlinedIcon,
  BarChartOutlinedIcon,
  ReceiptOutlinedIcon,
  PeopleOutlineRoundedIcon,
  ArrowBackIosRoundedIcon,
  ArrowForwardIosRoundedIcon,
} from "./Icons";
import avatarDefault from "../../assets/user.png";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography className="!text-[16px] !font-poppins">{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    setLogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background:  "#fff !important",
        },
        "& .pro-icon-wrapper": {
         backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: "#000",
        },
      }}
      className="!bg-white"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        <Menu iconShape="square">
          {/* logo and menu icon */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosRoundedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Link to="/">
                  <h3 className="text-[25px] font-poppins uppercase  text-black">
                    Kairaa 
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <ArrowBackIosRoundedIcon className="text-black " />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="user-profile"
                  width={100}
                  height={100}
                  src={user?.avatar  ? user?.avatar?.url : avatarDefault}
                  className="rounded-full cursor-pointer  border-[3px] border-[#5b6fe6]"
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px text-black  font-bold"
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h8"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px text-black  font-bold capitalize"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10px"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text[18px] text-black capitalize font-bold">
              {!isCollapsed && "Data"}
            </Typography>

            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Registrations"
              to="/admin/registrations"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text[18px] text-black capitalize font-bold">
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text[18px] text-black capitalize font-bold">
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title="Gallery Image"
              to="/admin/upload-gallery-image"
              icon={<WebIcon />}
              selected={selected}
              setSelected={setSelected}
            />

               <Item
              title="Edit Gallery Image"
              to="/admin/edit-gallery-image"
              icon={<WysiwygIcon  />}
              selected={selected}
              setSelected={setSelected}
            />
              {/* <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text[18px] text-black  capitalize font-bold">
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<PeopleOutlineRoundedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             {/* <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text[18px] text-black  capitalize font-bold">
              {!isCollapsed && "Analytics"}
            </Typography>
               <Item
              title="Course Analytics"
              to="/admin/courses-analytics"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
               <Item
              title="Order Analytics"
              to="/admin/order-analytics"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
              title="User Analytics"
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
             <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text[18px] text-black capitalize font-bold">
              {!isCollapsed && "Extras"}
            </Typography>
            <Item
              title="Settings"
              to="/admin/settings"
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
