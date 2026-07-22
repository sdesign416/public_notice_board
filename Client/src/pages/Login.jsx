import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css" // CSS 파일 임포트

const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
    const [id, setId] = useState("")
    const [pw, setPw] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

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
        <main className="login-container">
            <div className="login-card-form">
                <h2>로그인</h2>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleClick} className="login-form">
                    <div className="form-group">
                        <label htmlFor="loginInput">아이디</label>
                        <input 
                            type="text" 
                            id="loginInput" 
                            placeholder="아이디를 입력하세요" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pwInput">비밀번호</label>
                        <input 
                            type="password" 
                            id="pwInput" 
                            placeholder="비밀번호를 입력하세요" 
                            value={pw} 
                            onChange={(e) => setPw(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" id="loginBtn" className="btn-login">로그인</button>
                        <button type="button" id="signBtn" className="btn-signup" onClick={handleSend}>회원가입</button>
                    </div>
                </form>
            </div>
        </main>
    )
}