import { Activity, useState } from "react"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "./Home.module.css"
import { AiOutlineHeart, AiFillHeart , AiOutlineUser} from "react-icons/ai";

const API_URL = import.meta.env.VITE_API_URL

export default function Home() {
    const [posts, setPosts] = useState([])
    const [currentUserId, setCurrentUserId] = useState("")
    const navigate = useNavigate()

    const fetchMyInfo = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (!response.ok) {
                throw new Error("유저 정보를 가져오는데 실패했습니다.")
            }

            const userJson = await response.json()
            setCurrentUserId(userJson.user_id)

        } catch (error) {
            console.error(error)
        }
    }

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

        } catch (error) {
            console.log("전체 포스트 조회 실패")
        }
    }

    useEffect(() => {
        fetchMyInfo() // 내 정보 먼저 가져오고
        fetchPosts()  // 게시글 목록 가져오기
    }, [])

    // 수정 함수
    const handleEdit = (post) => {
        const storedUser = localStorage.getItem("userid")
        if (storedUser === post.userid) {
            navigate("/post", { state: { post } })
        } else {
            alert("수정은 작성자 본인만 가능합니다")
        }
    }

    // 좋아요 버튼 클릭 핸들러
    const handleLike = async (id) => {
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

            await fetchPosts()

        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = async (val) => {
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

    const handleDelete = async (post) => {
        const token = localStorage.getItem("token")
        if (currentUserId !== post.idx) {
            alert("삭제는 작성자 본인만 가능합니다")
            return
        }

        const isConfirmed = window.confirm("게시글을 삭제하시겠습니까?")

        if (!isConfirmed) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/post/${post._id}`, {
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

const formatNiceDate = (isoString) => {
    if (!isoString) return ""
        const createdDate = new Date(isoString)
        const now = new Date()

        // 현재 시간 - 작성 시간
        const difference = now - createdDate

        // 잘못된 날짜
        if (Number.isNaN(createdDate.getTime())) {
            return ""
        }

        // 미래 시간으로 저장된 경우
        if (difference < 0) {
            return "방금 전"
        }

        const seconds = Math.floor(difference / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (seconds < 60) {
            return "방금 전"
        }

        if (minutes < 60) {
            return `${minutes}분 전`
        }

        if (hours < 24) {
            return `${hours}시간 전`
        }

        if (days < 30) {
            return `${days}일 전`
        }

        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(createdDate)
    }

    return (
        <section className={styles.homeContainer}>
            {/* 정렬 영역 */}
            <div className={styles.sortBox}>
                <select onChange={(e) => handleChange(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value="like">인기순</option>
                    <option value="oldest">오래된순</option>
                </select>
            </div>

            {/* 게시글 목록 */}
            <ul className={styles.postList}>

                {posts.map((post) => {
                    const isLiked = post.likes?.includes(currentUserId)

                    return (
                        <li className={styles.postItem} key={post._id}>
                            <div className={styles.imgBox}>
                                <img src={post.image ? `${API_URL}${post.image}` : `${API_URL}/basic/normal.jpg`} alt={post.title} />
                            </div>

                            <div className={styles.contWr}>
                                <p className={styles.title}>{post.title}</p>
                                <p className={styles.content}>{post.content}</p>
                                <div className={styles.btWr}>
                                    <div className={styles.likeBtn}>
                                        <button className={styles.likeBtn} type="button" onClick={() => handleLike(post._id)}>
                                            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                                        </button>
                                        <span>{post.likes?.length || 0} </span>
                                    </div>
                                    <div className={styles.date}>
                                        <span>{formatNiceDate(post.createdAt)}</span>
                                    </div>
                                    <div className="{styles.usename">
                                        <span>
                                            <AiOutlineUser /> {post.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.buttonBox}>
                                <button className={styles.editBtn} type="button" onClick={() => handleEdit(post)}>수정</button>
                                <button className={styles.delBtn} type="button" onClick={() => handleDelete(post)}>삭제</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}