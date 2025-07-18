import "../pages/devnavstyle.css";
import React, { useState, useEffect, useRef } from "react";

interface NavItem {
  id: number;
  icon: string;
  text: string;
  targetId: string;
}

const Navbar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const linkItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const [enableScrollSpy, setEnableScrollSpy] = useState(true);
  const scrollSpyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems: NavItem[] = [
    { id: 1, icon: "/icons/domain.png", text: "Domain", targetId: "domain" },
    {
      id: 2,
      icon: "/icons/scan.png",
      text: "Domain Scan",
      targetId: "domainscan",
    },
    {
      id: 3,
      icon: "/icons/secureAPI.png",
      text: "Secure API",
      targetId: "secureapi",
    },
    {
      id: 4,
      icon: "/icons/trap.png",
      text: "Honey Pot",
      targetId: "honeytrap",
    },
    {
      id: 5,
      icon: "/icons/dashboard.png",
      text: "Dashboard",
      targetId: "dashboard",
    },
    { id: 6, icon: "/icons/history.png", text: "History", targetId: "history" },
  ];

  const handleLinkClick = (index: number, targetId: string) => {
    setActiveIndex(index);
    setEnableScrollSpy(false);

    const section = document.getElementById(targetId);
    section?.scrollIntoView({ behavior: "smooth" });

    if (scrollSpyTimeoutRef.current) clearTimeout(scrollSpyTimeoutRef.current);
    scrollSpyTimeoutRef.current = setTimeout(() => {
      setEnableScrollSpy(true);
    }, 800);
  };

  useEffect(() => {
    const onScroll = () => {
      if (!enableScrollSpy) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      navItems.forEach((item, index) => {
        const section = document.getElementById(item.targetId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableScrollSpy]);

  useEffect(() => {
    const updateIndicator = () => {
      if (indicatorRef.current && linkItemsRef.current[activeIndex]) {
        const linkItem = linkItemsRef.current[activeIndex];
        const left = linkItem.offsetLeft + 43; // adjust if needed
        indicatorRef.current.style.left = `${left}px`;
      }
    };

    window.addEventListener("resize", updateIndicator);
    updateIndicator();

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex]);

  return (
    <nav className="nav">
      <ul className="nav-content">
        {navItems.map((item, index) => (
          <li className="nav-list" key={item.id}>
            <a
              href="#"
              className={`link-item ${activeIndex === index ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault(); // prevent page jump
                handleLinkClick(index, item.targetId);
                const section = document.getElementById(item.targetId);
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              ref={(el) => (linkItemsRef.current[index] = el)}
            >
              <img src={item.icon} alt={item.text} className="link-icon" />
              <span className="link-text">{item.text}</span>
            </a>
          </li>
        ))}
        <span className="indicator" ref={indicatorRef}></span>
      </ul>
    </nav>
  );
};

export default Navbar;
