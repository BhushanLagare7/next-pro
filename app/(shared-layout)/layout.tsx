import { Navbar } from "@/components/web/navbar";

const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default SharedLayout;
