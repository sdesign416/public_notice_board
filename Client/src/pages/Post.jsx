import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./Post.css"

const API_URL = import.meta.env.VITE_API_URL

export default function Post() {
    const location = useLocation()
    const navigate = useNavigate()

    // 목록 페이지에서 전달받은 게시글
    const post = location.state?.post

    // post가 있으면 수정 모드
    const isEdit = Boolean(post?._id)

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [img, setImg] = useState(null)
    const [error, setError] = useState("")
    const [preview, setPreview] = useState("")

    /*
     * 수정 페이지로 들어왔을 때
     * 기존 게시글 내용을 입력창에 넣기
     */
    useEffect(() => {
        if (isEdit) {
            setTitle(post.title || "")
            setContent(post.content || "")

            // 실제 이미지 저장 구조에 맞게 수정
            setPreview(post.image || "")
        }
    }, [isEdit, post])

    const resetForm = () => {
        setError("")
        setImg(null)

        if (isEdit) {
            // 수정 모드에서는 기존 내용으로 되돌리기
            setTitle(post.title || "")
            setContent(post.content || "")
            setPreview(post.image || "")

            navigate("/home")
        } else {
            // 작성 모드에서는 모두 비우기
            setTitle("")
            setContent("")
            setPreview("")
        }
    }

    // 이미지 등록
    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (!file) {
            setImg(null)

            // 수정 중이면 기존 이미지 표시
            if (isEdit) {
                setPreview(post.image)
            } else {
                setPreview("")
            }

            return
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 등록할 수 있습니다.")
            e.target.value = ""
            setImg(null)
            return
        }

        setImg(file)
        setPreview(URL.createObjectURL(file))
    }

    // 작성 또는 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.")
            return
        }

        try {
            setError("")

            const token = localStorage.getItem("token")
            const formData = new FormData()

            console.log("수정 요청 token:", token)

            formData.append("title", title.trim())
            formData.append("content", content.trim())

            // 새 이미지가 선택됐을 때만 전송
            if (img) {
                formData.append("image", img)
            }

            const requestUrl = isEdit
                ? `${API_URL}/post/${post._id}`
                : `${API_URL}/post`

            const requestMethod = isEdit
                ? "PUT"
                : "POST"

            const response = await fetch(requestUrl, {
                method: requestMethod,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "요청 처리에 실패했습니다."
                )
            }

            alert(
                isEdit
                    ? "글이 수정되었습니다."
                    : "글이 작성되었습니다."
            )

            // 성공 후 게시글 목록으로 이동
            navigate("/home")
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }

    return (
        <main className="post-container">
            <div className="post-card-form">
                <h1>
                    {isEdit ? "글 수정" : "글 작성"}
                </h1>

                <form onSubmit={handleSubmit} className="post-form">
                    <div className="form-group">
                        <label htmlFor="title">제목</label>

                        <input
                            id="title"
                            type="text"
                            placeholder="제목을 입력하세요."
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">내용</label>

                        <textarea
                            id="content"
                            placeholder="내용을 입력하세요."
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                        <label htmlFor="image" className="image-upload-btn">
                            {isEdit ? "이미지 변경" : "이미지 등록"}
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />

                        {preview && (
                            <div className="preview-container">
                                <img src={img ? preview : `${API_URL}${preview}`} alt="미리보기" className="preview-image" />
                                <button
                                    type="button"
                                    className="remove-img-btn"
                                    onClick={() => { setImg(null); setPreview(""); }}
                                >
                                    이미지 취소
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            {isEdit ? "수정 완료" : "작성"}
                        </button>

                        <button className="btn-cancel"
                            type="button"
                            onClick={resetForm}
                        >
                            되돌리기
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}