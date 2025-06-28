import React from "react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div className="font-light text-4xl text-pink-600 mb-6 ">ArtistBridge</div>
      {children}
    </section>
  );
};

export default AuthLayout;
