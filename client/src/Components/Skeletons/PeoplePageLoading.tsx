
const PeoplePageLoading = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full gap-8">
      <div className="h-7 md:h-9 w-full bg-blue-gray-700 rounded-lg px-2 md:px-4"></div>
      <div className="overflow-y-hidden flex flex-col gap-4 w-[24rem]">
        <div className="flex flex-col gap-3 w-full">
          {Array(6)
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
                  <div className="flex items-center gap-1">
                    <div className="rounded-full bg-blue-gray-700 h-6 w-6"></div>
                    <div className="rounded-full bg-blue-gray-700 h-6 w-6"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PeoplePageLoading;
