import { Carousel } from "@material-tailwind/react";
import moment from "moment";

//importing types
import { PostDataInterface } from "../../../Types/post";

const PostInfo = ({post} : {post: PostDataInterface}) => {
  return (
    <div className="w-full rounded-lg border shadow-lg bg-white">
          <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
            <div className="px-4">
              <div
                className="mt-2 text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: post?.description as TrustedHTML,
                }}
              ></div>
              <div className="mt-4 mb-2">
                {post?.hashtagsArray?.map((hashtag, index) => (
                  <span
                    className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold transition ease-in-out duration-150 text-gray-900 cursor-pointer hover:scale-105 hover:text-gray-100 hover:bg-gray-900"
                    key={index}
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
            {post.image && post?.image.length > 0 && (
              <div className="flex items-center justify-self-center px-1 w-full h-72">
                {post.image.length > 1 ? (
                  <Carousel
                    className="w-full h-full"
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                        {new Array(length).fill("").map((_, i) => (
                          <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                              activeIndex === i
                                ? "w-8 bg-white"
                                : "w-4 bg-white/50"
                            }`}
                            onClick={() => setActiveIndex(i)}
                          />
                        ))}
                      </div>
                    )}
                  >
                    {post?.image.map((image, index) => (
                      <img
                        src={image}
                        alt="post-image"
                        className="h-full w-full object-cover rounded-lg"
                        key={index}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <img
                    src={post.image[0]}
                    alt="Laptop"
                    className="h-full w-full rounded-lg object-cover"
                  />
                )}
              </div>
            )}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-start gap-4 px-2">
                <span className="text-[12px] font-medium text-gray-500">
                  {post.likes && post.likes.length} likes
                </span>
                <span className="text-[12px] font-medium text-gray-500">
                  {post.comments && post.comments.length} comments
                </span>
              </div>
              <span className="text-[12px] font-medium text-gray-500">
                {moment(post.createdAt).startOf("minutes").fromNow()}
                {post.createdAt !== post.updatedAt && " ( Edited )"}
              </span>
            </div>
          </div>
        </div>
  )
}

export default PostInfo