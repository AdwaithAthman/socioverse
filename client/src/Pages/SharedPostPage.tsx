import { useEffect } from "react"
import { useParams } from "react-router-dom"

const SharedPostPage = () => {
    const { postId } = useParams<{ postId: string }>()

    // useEffect(() => {
    // }, [postId])

  return (
    <div>SharedPostPage</div>
  )
}

export default SharedPostPage