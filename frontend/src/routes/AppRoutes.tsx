import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import StoryViewer from "@/pages/StoryViewer";
import CreatePost from "@/components/post/CreatePost";
import Profile from "@/pages/Profile";
import MyProfile from "@/components/profile/MyProfile";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import PrivateRoute from "@/components/core/auth/PrivateRoute";
import OpenRoute from "@/components/core/auth/OpenRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
      <Route path="/register" element={<OpenRoute><Register /></OpenRoute>} />
      <Route path="/story/:username/:storyId" element={<PrivateRoute><StoryViewer /></PrivateRoute>} />
      <Route path="/create/post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
      <Route path="/profile/:username" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
      <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;
