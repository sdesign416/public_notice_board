import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css" // CSS 파일 임포트

const API_URL = import.meta.env.VITE_API_URL

export default function Auth() {
    const [userid, setUserid] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userid.trim() || !password.trim() || !name.trim() || !email.trim()) {
            alert("모든 정보를 입력하세요")
            return
        }

        try {
            setError("")
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userid,
                    password,
                    name,
                    email
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "응답없음")
            }

            // 백엔드가 user로 아이디 문자열을 보내주던 구조에 맞게 수정
            localStorage.setItem("token", data.token)
            localStorage.setItem("userid", data.user.userid)

            console.log("token: ", data.token)
            console.log("userid:",data.user.userid)
            navigate('/home')

        } catch (error) {
            console.log("회원가입 오류", error)
            setError(error.message)
        }
    }

    return (
        <main className="auth-container">
            <div className="auth-card-form">
                <h2>회원가입</h2>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="userid">아이디</label>
                        <input 
                            type="text" 
                            id="userid" 
                            placeholder="아이디를 입력하세요" 
                            value={userid} 
                            onChange={(e) => setUserid(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="비밀번호를 입력하세요" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="이름을 입력하세요" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="이메일을 입력하세요" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" id="signupBtn" className="btn-signup-submit">가입하기</button>
                        <button type="button" className="btn-back" onClick={() => navigate('/')}>돌아가기</button>
                    </div>
                </form>
            </div>
        </main>
    )
}