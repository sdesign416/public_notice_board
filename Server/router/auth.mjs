import express from "express"
import * as authController from "../controller/auth.mjs"
import { isAuth } from "../middleware/auth.mjs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// 회원가입
// http://127.0.0.1:8080/auth/signup (POST)
router.post("/signup", authController.signup)

//회원가입 UI
// http://127.0.0.1:8080/auth/signup (GET)
router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"))
})

// 로그인
// http://127.0.0.1:8080/auth/login (POST)
router.post("/login", authController.login)

// 로그인 UI
// http://127.0.0.1:8080/auth/login (GET)
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"))
})

// 로그인 유지 체크
// http://127.0.0.1:8080/auth/me (GET)
router.get("/me", isAuth, authController.me)

export default router