import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db/database.mjs"
import { config } from "./config.mjs"
import authRouter from "./router/auth.mjs"
import postsRouter from "./router/posts.mjs"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, "public")))

const PORT = process.env.HOST_PORT || 8080
const MONGODB_URI = process.env.DB_HOST

const allowOrigin = ["http://localhost:5173","https://fv3wqq31-5173.jpe1.devtunnels.ms","http://127.0.0.1:8080"]

app.use(
    cors({
        origin: allowOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

app.use(express.json())


app.get("/", (req, res) => {
    res.send("Node.js 서버가 정상 실행 중입니다.")
})

app.use("/auth", authRouter)
app.use("/post", postsRouter)

connectDB().then(() => {
    app.listen(config.host.port, () => {
        console.log("DB/웹 서버 실행 중...")
    })
}).catch(console.error)