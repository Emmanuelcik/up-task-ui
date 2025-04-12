import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      onClick={toggleMenu}
      // Increase button size, remove overflow clipping, and center the spans
      className="relative w-12 h-12 flex flex-col items-center justify-center overflow-visible focus:outline-none"
    >
      {/* Top bar */}
      <span
        className={`
          block w-8 h-1 bg-black transition-transform duration-300 ease-in-out
          ${isOpen ? "rotate-45 translate-y-2 origin-center" : "origin-center"}
        `}
      ></span>
      {/* Middle bar */}
      <span
        className={`
          block w-8 h-1 bg-black my-1 transition-opacity duration-300 ease-in-out
          ${isOpen ? "opacity-0" : ""}
        `}
      ></span>
      {/* Bottom bar */}
      <span
        className={`
          block w-8 h-1 bg-black transition-transform duration-300 ease-in-out
          ${
            isOpen ? "-rotate-45 -translate-y-2 origin-center" : "origin-center"
          }
        `}
      ></span>
    </button>
  );
};

export default Menu;
