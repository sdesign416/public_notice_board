import { Activity, useState } from "react"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "./Home.module.css"

const API_URL = import.meta.env.VITE_API_URL
export default function Home() {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await fetch(`${API_URL}/post`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error(`포스트 조회 실패: ${response.status}`)
            }

            const data = await response.json()
            setPosts(data)
            console.log(data);

        } catch (error) {
            console.log("전체 포스트 조회 실패")
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    //수정 함수
    const handleEdit = (post) => {
        navigate("/post", { state: { post } })
    }

    // 좋아요 버튼 클릭 핸들러 (추후 API 연동)
    const handleLike = async (id) => {
        console.log("좋아요:", id)

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/post/${id}/like`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("게시글 좋아요에 실패했습니다.")
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = async (val) => {
        console.log(val)

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/post/sorts?sort=${val}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("게시글 정렬에 실패했습니다.")
            }

            const data = await response.json()
            setPosts(data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        const isconfirmed = window.confirm("게시글을 삭제하시겠습니까?")
        if (!isconfirmed) {
            return
        }

        const token = localStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}/post/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("게시글 삭제에 실패했습니다.")
            }

            await fetchPosts()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <ul className={styles.postList}>
            <select onChange={(e) => handleChange(e.target.value)}>
                <option value="latest">최신순</option>
                <option value="like">인기순</option>
                <option value="oldest">오래된순</option>
            </select>
            {posts.map((post) => (
                <li className={styles.postItem} key={post._id}>
                    <div className={styles.imgBox}>
                        <img src={post.image ? `${API_URL}${post.image}` : `${API_URL}/basic/nomal.jpg`} alt={post.title} />
                    </div>

                    <div className={styles.contWr}>
                        {/* 제목과 좋아요 버튼을 묶어주는 영역 */}
                        <div className={styles.titleRow}>
                            <strong className={styles.title}>{post.title}</strong>
                            <button className={styles.likeBtn} type="button" onClick={() => handleLike(post._id)}>
                                ❤️
                            </button>
                        </div>
                        <p className={styles.content}>{post.content}</p>
                    </div>

                    <div className={styles.buttonBox}>
                        <button className={styles.editBtn} type="button" onClick={() => handleEdit(post)}>수정</button>
                        <button className={styles.delBtn} type="button" onClick={() => handleDelete(post._id)}>삭제</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}