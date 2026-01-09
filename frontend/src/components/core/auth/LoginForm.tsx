import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "./PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { type LoginPayload } from "@/types/auth";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const LoginForm: React.FC = () => {
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const { login, authIsLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange =
    (key: keyof LoginPayload) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [key]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success(result.message || "Login successful!");
      navigate("/");
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-slate-400 hover:text-white"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-slate-200"
          disabled={authIsLoading}
        >
          {authIsLoading ? (
            <>
              <LoaderCircle className="animate-spin mr-2" size={16} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>

      <p className="text-slate-400 text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-white hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
