const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950" />

      {/* Animated blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
    </div>
  );
};

export default AnimatedBackground;
