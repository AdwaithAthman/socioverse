import { useMutation } from "@tanstack/react-query";
import { uploadPost } from "../../API/Post";
import { useDispatch } from "react-redux";
import { setPost } from "../../Redux/PostSlice";

export const usePostUploadMutation = () => {
    const dispatch = useDispatch();
    return useMutation(async (postData: FormData) => {
        const postInfo = await uploadPost(postData);
        return postInfo;
    }, {
        onSuccess: (postInfo) => {
            dispatch(setPost(postInfo))
        }
    })
}