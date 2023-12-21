import ChatLoading from "./ChatLoading";

const ChatPageLoading = () => {
  return (
    <div className="w-full h-[80vh] lg:h-[85vh] ">
      <div className="flex justify-between items-center w-full h-full p-2 gap-5">
        <div className="md:block md:w-4/12 h-full bg-white border border-blue-300 rounded-xl w-full">
          <div className="flex items-center-justify-between mb-4 mt-2">
            <div className="h-12 w-full bg-white rounded-lg flex items-center justify-center animate-pulse px-3 mb-2">
              <div className="flex items-center justify-between gap-10 w-full">
                <div className="h-7 w-full bg-blue-gray-700 rounded-full "></div>
                <div className="flex items-center gap-2 w-full">
                  <div className="h-7 w-[75%] bg-blue-gray-700 rounded-full "></div>
                  <div className="rounded-full bg-blue-gray-700 h-7 w-7"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-y-hidden flex flex-col gap-4 w-full px-3">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <ChatLoading key={index} />
              ))}
          </div>
        </div>
        <div className="md:block md:w-8/12 h-full bg-white border border-blue-300 rounded-xl hidden">
          <div className="flex flex-col justify-between p-2 md:p-4 gap-4 md:gap-8 h-full w-full animate-pulse">
            <header className="flex items-center justify-between w-full">
              <div className="flex items-center justify-start gap-4 w-full">
                <div className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-gray-700" />
                <div className="h-9 w-48 bg-blue-gray-700 rounded-full"></div>
              </div>
              <div className="flex items-center justify-end gap-4 w-full">
                <div className="flex justify-center items-center h-7 w-7 rounded-full bg-blue-gray-700 "></div>
                <div className="flex justify-center items-center h-7 w-7  rounded-full bg-blue-gray-700"></div>
                <div className="flex justify-center items-center h-7 w-7  rounded-full bg-blue-gray-700"></div>
              </div>
            </header>
            <div className=" h-full w-full flex flex-col justify-end gap-4 overflow-y-scroll no-scrollbar bg-blue-gray-300/50 rounded-xl">
              <div className="flex items-center w-full gap-2 px-4 mb-5">
                <div className="h-9 w-full bg-blue-gray-700 rounded-full"></div>
                <div className="flex items-center justify-end gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-gray-700"></div>
                  <div className="h-7 w-7 rounded-full bg-blue-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPageLoading;
