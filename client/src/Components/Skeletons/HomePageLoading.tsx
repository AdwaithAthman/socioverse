import ChatLoading from "./ChatLoading";
import PostCardLoading from "./PostCardLoading";

const HomePageLoading = () => {
  return (
    <div className="lg:flex gap-3 items-start justify-between h-[80vh] lg:h-[85vh]">
      <aside className="hidden lg:flex flex-col gap-5 w-3/12 px-3 sticky top-28 overflow-y-auto h-[80vh] no-scrollbar animate-pulse">
        <div className="h-12 w-full bg-white rounded-lg flex items-center justify-center animate-pulse border border-blue-300">
          <div className="flex items-center justify-between gap-2 w-full mx-4">
            <div className="h-5 w-[60%] bg-blue-gray-700 rounded-full "></div>
            <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
          </div>
        </div>
        <div className="h-12 w-full bg-white rounded-lg flex items-center justify-center animate-pulse border border-blue-300">
          <div className="flex items-center justify-between gap-2 w-full mx-4">
            <div className="h-5 w-[60%] bg-blue-gray-700 rounded-full "></div>
            <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
          </div>
        </div>
      </aside>
      <main className="w-full lg:w-6/12 px-3 md:px-6 overflow-x-hidden overflow-y-auto h-[85vh] no-scrollbar flex flex-col items-center p-2">
        <div className="flex items-center justify-between w-full md:p-2 mb-8 gap-3 md:gap-5 sticky top-0 z-40">
          <div className="flex items-center justify-between gap-3 w-full animate-pulse">
            <div className="rounded-full bg-blue-gray-700 h-12 w-12 md:h-14 md:w-14"></div>
            <div className="h-10 md:h-12 w-full bg-blue-gray-500 rounded-full"></div>
          </div>
        </div>
        <div className=" overflow-y-auto h-[85vh] w-full no-scrollbar flex flex-col items-center">
          <div className="mb-10 w-full md:mx-2 ">
            <div className="mb-10 max-w-[21rem] md:max-w-[30rem] mx-auto">
              <PostCardLoading />
            </div>
          </div>
        </div>
      </main>
      <aside className="hidden lg:block w-3/12 px-3 pb-5 sticky top-28 overflow-hidden">
        <div
          className="h-96 w-full bg-white rounded-lg flex flex-col items-center
        gap-4 animate-pulse border border-blue-300 p-4 overflow-hidden"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
            <div className="h-5 w-[75%] bg-blue-gray-700 rounded-full "></div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  className="shadow-md rounded-lg p-3 w-full mx-auto"
                  key={index}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="animate-pulse flex space-x-2 w-[75%]">
                      <div className="rounded-full bg-blue-gray-700 h-10 w-10"></div>
                      <div className="flex-1 space-y-6 py-1">
                        <div className="space-y-3">
                          <div className="h-2 bg-blue-gray-700 rounded"></div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-blue-gray-700 rounded col-span-2"></div>
                            <div className="h-2 bg-blue-gray-700 rounded col-span-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-full bg-blue-gray-700 h-6 w-6"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HomePageLoading;
