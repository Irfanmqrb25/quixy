import getCurrentUser from "@/actions/getCurrentUser";
import Container from "@/components/Container";
import SideBar from "@/components/Sidebar/SideBar";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/signin");
  }

  return (
    <>
      <SideBar>
        <Container>{children}</Container>
      </SideBar>
      {modal}
    </>
  );
}
