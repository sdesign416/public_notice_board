import express from "express"
import { isAuth } from "../middleware/auth.mjs"
import * as postController from "../controller/posts.mjs"
import path from "path"
import { fileURLToPath } from "url"
import { uploadPostImage } from "../middleware/imgUpload.mjs"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// 미리보기
router.get("/preview", postController.previewPosts)

// 전체 포스트 가져오기
// http://127.0.0.1:8080/post (GET)
// http://127.0.0.1:8080/post?userid=apple (GET)
router.get("/",isAuth,postController.getPosts)

// 정렬된 포스트 가져오기
// http://127.0.0.1:8080/post/sorts?sort=oldest (GET)
router.get("/sorts", isAuth, postController.sortsPost)

// 포스트UI
// http://127.0.0.1:8080/post/posts
router.get("/posts", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/post.html"))
})

// 글번호에 대한 포스트 가져오기
// http://127.0.0.1:8080/6a4715cd25ffb36d42552d67 (GET)
router.get("/:postid",isAuth,postController.getPost)

// 포스트 쓰기
// http://127.0.0.1:8080/post
router.post("/", isAuth, uploadPostImage.single("image"), postController.createPost) // 로그인한 사용자만 작성 가능하도록

// 포스트 수정하기
// http://127.0.0.1:8080/post/:id (PUT)
router.put("/:postid",isAuth,uploadPostImage.single("image"),postController.updatePost)

// 포스트 좋아요 수정하기
// http://127.0.0.1:8080/post/:id/like (PUT)
router.put("/:postid/like",isAuth,postController.likePost)

// 포스트 삭제하기
// http://127.0.0.1:8080/post/:id (DELETE)
router.delete("/:postid",isAuth,postController.deletePost)


export default router