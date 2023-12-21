const PostCardLoading = () => {
  return (
    <div className=" w-full mx-auto animate-pulse flex flex-col gap-2">
      <div className="flex space-x-4">
        <div className="rounded-full bg-blue-gray-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="space-y-3">
            <div className="h-2 w-[40%] bg-blue-gray-700 rounded col-span-2"></div>
            <div className="h-2 w-[30%] bg-blue-gray-700 rounded col-span-1"></div>
          </div>
        </div>
      </div>
      <div className="mx-2 border border-blue-300 rounded-lg flex flex-col w-full h-fit">
        <div className="flex-1 space-y-6 py-1 m-4 ">
          <div className="space-y-3">
            <div className="h-2 bg-blue-gray-700 rounded"></div>
            <div className="h-2 bg-blue-gray-700 rounded"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-4 bg-blue-gray-500 rounded-full col-span-1"></div>
            <div className="h-4 bg-blue-gray-500 rounded-full col-span-1"></div>
            <div className="h-4 bg-blue-gray-500 rounded-full col-span-1"></div>
            <div className="h-4 bg-blue-gray-500 rounded-full col-span-1"></div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-72 w-full rounded-lg bg-blue-gray-200"></div>
            <div className="flex items-center justify-between mx-2">
            <div className="flex gap-4">
              <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
              <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
              <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
            </div>
            <div className="rounded-full bg-blue-gray-700 h-5 w-5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardLoading;
