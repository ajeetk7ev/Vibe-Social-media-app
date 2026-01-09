interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 56,
}) => {
  return (
    <div
      className="rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold overflow-hidden"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        name[0].toUpperCase()
      )}
    </div>
  );
};

export default Avatar;
