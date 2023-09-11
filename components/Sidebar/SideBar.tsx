import getCurrentUser from "@/actions/getCurrentUser";
import DesktopSideBar from "./DesktopSideBar";
import MobileFooter from "./MobileFooter";
import MobileNav from "./MobileNav";

const SideBar = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSideBar currentUser={currentUser!} />
      <MobileNav />
      <main className="h-full lg:pl-20">{children}</main>
      <MobileFooter user={currentUser!} />
    </div>
  );
};

export default SideBar;
