import express from "express"
import { config } from "./config.mjs" // config를 export할 때 { } 형태로 내보냈기 때문
import { connectDB } from "./db/database.mjs"
import authRouter from "./router/auth.mjs"
import postsRouter from "./router/posts.mjs"

const app = express()

// 미들웨어 등록
app.use(express.json())
app.use(express.static("public"))
app.use("/auth", authRouter)
app.use("/post", postsRouter)

app.use((req,res)=>{
    res.sendStatus(404)
})

connectDB().then(() => {
    app.listen(config.host.port, () => {
        console.log("DB/웹 서버 실행 중...")
    })
}).catch(console.error)