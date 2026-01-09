import { Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  value?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="bg-slate-900 border-slate-800 text-white pr-10"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
