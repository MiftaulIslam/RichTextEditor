import ArticlesLayout from "./ArticlesLayout";

const HomeLayout = () => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <ArticlesLayout />
        {/* Navbar */}
        {/* <Navbar /> */}
        {/* {userdata?.message ? <p>{userdata.message}</p> : <p>No user data found</p>} */}
      </div>
    </main>
  );
};

export default HomeLayout;
