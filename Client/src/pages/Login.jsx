import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css" // CSS 파일 임포트

const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
    const [id, setId] = useState("")
    const [pw, setPw] = useState("")
    const [error, setError] = useState("")
    const [posts, setPosts] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchPreviewPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/post/preview`)
                if (!response.ok) {
                    const text = await response.text()
                    console.error("서버 응답:", response.status, text)
                    throw new Error(`미리보기 조회 실패: ${response.status}`)
                }
                const data = await response.json()
                console.log("미리보기 포스트:", data)
                setPosts(data)
            } catch (error) {
                console.error("전체 포스트 조회 실패", error)
            }
        }
        fetchPreviewPosts()
    }, [])


    const handleSend = () => {
        navigate('/auth')
    }

    const handleClick = async (e) => {
        e.preventDefault()
        if (!id.trim() || !pw.trim()) {
            alert("아이디와 비밀번호를 입력하세요")
            return
        }

        try {
            setError("")
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userid: id,
                    password: pw
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "로그인에 실패했습니다.")
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("userid", data.user.userid)

            navigate('/home')

        } catch (error) {
            console.error("로그인 오류", error)
            setError(error.message)
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginFormWr}>
                <h2>로그인</h2>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleClick} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="loginInput">아이디</label>
                        <input 
                            type="text" 
                            id="loginInput" 
                            placeholder="아이디를 입력하세요" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="pwInput">비밀번호</label>
                        <input 
                            type="password" 
                            id="pwInput" 
                            placeholder="비밀번호를 입력하세요" 
                            value={pw} 
                            onChange={(e) => setPw(e.target.value)}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" id="loginBtn" className={styles.btnLogin}>로그인</button>
                        <button type="button" id="signBtn" className={styles.btnSignup} onClick={handleSend}>회원가입</button>
                    </div>
                </form>
            </div>
            <ul className={styles.previewList}> 
                <p className={styles.subTit}>
                    최근 게시글
                    <span>로그인 후 게시판 전체 열람이 가능합니다.</span>
                </p>
            {posts.map((post) => (
                <li key={post._id} className={styles.prevBoard}>

                    <div >
                        <strong>{post.title}</strong>
                        {/* <p>{post.name}</p> */}
                        <p>{post.content}</p>
                    </div>

                </li>
            ))}
            </ul>
        </div>
    )
}