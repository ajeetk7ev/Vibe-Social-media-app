import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import StoryViewer from "@/pages/StoryViewer";
import CreatePost from "@/components/post/CreatePost";
import Profile from "@/pages/Profile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/story/:username/:storyId" element={<StoryViewer />} />
      <Route path="/create/post" element={<CreatePost />} />
       <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
