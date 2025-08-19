import { useUserInfo } from "@/hooks/useUserInfo";
import ArticlesLayout from "./ArticlesLayout";
import LandingPage from "@/pages/LandingPage";

const HomeLayout = () => {
  const userInfo = useUserInfo();
  if (userInfo) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto px-4 py-4 max-w-7xl">
          <ArticlesLayout />
        </div>
      </main>
    );
  } else {
    // User is not logged in
    return (
      <LandingPage/>
    );
  }
};

export default HomeLayout;
