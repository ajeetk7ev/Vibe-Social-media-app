
import AuthCard from "@/components/core/auth/AuthCard";
import RegisterForm from "@/components/core/auth/RegisterForm";


const Register: React.FC = () => {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
       <AuthCard
  title="Create Account"
  description="Join us and start sharing your moments"
>
  <RegisterForm />
</AuthCard>
      </main>
    </>
  );
};

export default Register;
