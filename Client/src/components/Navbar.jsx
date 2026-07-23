import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

export default function Navbar() {
    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    const handleSend = () => {
        navigate("/post")
    }

    const handleLogout = () => {
        const isConfirmed = window.confirm("로그아웃 하시겠습니까?")

        if (!isConfirmed) {
            return
        }

        localStorage.removeItem("token")
        localStorage.removeItem("userid")
        navigate("/")
    }

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* 로고 / 홈 링크 */}
                <div className="navbar-left">
                    <Link to="/home" className="navbar-logo">
                        MyApp
                    </Link>
                </div>

                {/* 우측 메뉴 및 버튼 영역 */}
                <div className="navbar-right">

                    {token && (
                        <button
                            type="button"
                            className="navbar-btn"
                            onClick={handleSend}
                        >
                            작성
                        </button>
                    )}

                    {token && (
                        <button
                            type="button"
                            className="navbar-btn"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    )}
                </div>
            </nav>
        </header>
    )
}