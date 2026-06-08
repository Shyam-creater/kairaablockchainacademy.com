
import { menuItemsData } from "./menuItemsData";
import React, { useEffect, useRef, useState } from "react";
import MobileMenuItems from "../components/dummy/MobileMenuItems";
import MenuItems from "../components/dummy/MenuItems";



const NavItems = ({ activeItem, isMobile,open,setOpen }) => {
  const depthLevel = 0;
  const [showMenu, setShowMenu] = useState(false);
  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (showMenu && ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showMenu]);
  return (
    <>

<nav className="desktop-nav ">
      <ul className="menus">
        {menuItemsData.map((menu, index) => {
          return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
        })}
      </ul>
    </nav>



      {isMobile && (
        <nav className="mobile-nav">
  

          <ul className="menus" ref={ref}>
            {menuItemsData.map((menu, index) => {
              return (
                <MobileMenuItems
                  items={menu}
                  key={index}
                  depthLevel={depthLevel}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              );
            })}
          </ul>
    
      </nav>

          
        
      )}
    </>
  );
};

export default NavItems;
