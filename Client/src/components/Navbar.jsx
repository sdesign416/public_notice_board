import { Link } from "react-router-dom"
import "./Navbar.css" // CSS 파일 임포트
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()

    const handleSend = async (e) => {
        navigate('/post')
    }
    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                {/* 로고 / 홈 링크 */}
                <div className="navbar-left">
                    <Link to="/home" className="navbar-logo">
                        MyApp
                    </Link>
                    <div className="navbar-links">
                        <Link to="/home">홈</Link>
                    </div>
                </div>

                {/* 우측 메뉴 및 버튼 영역 */}
                <div className="navbar-right">
                    <h1 className="navbar-menu-title">메뉴</h1>
                    <button type="button" className="navbar-btn" onClick={handleSend}>
                        작성
                    </button>
                </div>
            </nav>
        </header>
    )
}