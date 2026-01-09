interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 text-center">
       

        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
