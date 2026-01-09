interface Props {
  progress: number;
}

const StoryProgress: React.FC<Props> = ({ progress }) => {
  return (
    <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
      <div className="flex-1 h-1 bg-white/30 rounded">
        <div
          className="h-full bg-white rounded transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StoryProgress;
