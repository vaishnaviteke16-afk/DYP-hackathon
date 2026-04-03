import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Bell, Menu } from "lucide-react";
import profile from "../assets/profile.jpg";
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBack = location.pathname !== "/";

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      
      <div className="flex items-center gap-3">
        
        {/* Menu (mobile) */}
        <Menu
          className="md:hidden cursor-pointer"
          onClick={onMenuClick}
        />

        {/* Back Button */}
        {showBack && (
          <ArrowLeft
            className="cursor-pointer hover:scale-110 transition"
            onClick={() => navigate(-1)}
          />
        )}

         
      </div>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />
       <img
  src={profile}
  alt="profile"
  className="rounded-full border"
/>
      </div>
    </div>
  );
};

export default Header;