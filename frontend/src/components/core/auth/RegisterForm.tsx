import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "./PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { type RegisterPayload } from "@/types/auth";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
  });
  const { register, authIsLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange =
    (key: keyof RegisterPayload) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [key]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(form.username, form.email, form.password);
    if (result.success) {
      toast.success(result.message || "Registration successful!");
      navigate("/");
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          placeholder="Username"
          value={form.username}
          onChange={handleChange("username")}
          className="bg-slate-900 border-slate-800 text-white"
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange("email")}
          className="bg-slate-900 border-slate-800 text-white"
          required
        />

        <PasswordInput
          placeholder="Password"
          value={form.password}
          onChange={handleChange("password")}
          
        />

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-slate-200"
          disabled={authIsLoading}
        >
          {authIsLoading ? (
            <>
              <LoaderCircle className="animate-spin mr-2" size={16} />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </div>

      <p className="text-slate-400 text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-white hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
