// import Header from "@/components/common/Header";
import AuthCard from "@/components/core/auth/AuthCard";
import LoginForm from "@/components/core/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <AuthCard
          title="Welcome Back"
          description="Login to continue sharing moments"
        >
          <LoginForm />
        </AuthCard>
      </main>
    </>
  );
};

export default Login;
