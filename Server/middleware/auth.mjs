import jwt from "jsonwebtoken"
import {config} from "../config.mjs"
import * as authRepository from "../data/auth.mjs"

const AUTH_ERROR = { message: "인증에러" }

export const isAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization")
    console.log(authHeader)

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        console.log("헤더에러")
        return res.status(401).json(AUTH_ERROR)
    }

    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDVmNjYwMDMxZjEwMzUwZWE1Y2NiNiIsImlhdCI6MTc4MzAzODA1NiwiZXhwIjoxNzgzMTI0NDU2fQ.uvhWkGogD9-eb1EUs5TixyQK8NxynQ_QKbX-zNpWh0Y

    const token = authHeader.split(" ")[1]
    jwt.verify(token,config.jwt.secretKey,async (error,decoded)=>{ // decoded에 토큰 복호화해 id iat exp 구함
        if(error){
            console.log("토큰에러") // 토큰이 변조,변질되어 복호화가 제대로 안된 경우
            return res.status(401).json(AUTH_ERROR)
        }
        // console.log(decoded)
        const user = await authRepository.findById(decoded.id)
        if(!user){
            console.log("해당 아이디 없음")
            return res.status(401).json(AUTH_ERROR)
        }
        console.log("user.id: ",user.id)
        console.log("user.userid: ",user.userid)
        req.id = user.id // controller에 넘겨주기 위해
        req.token = token

        next()
    })
}

/*
 로그인 유지 미들웨어
 - 헤더를 읽어 토큰을 가져옴
 - 토큰을 복호화
 - 복호화한 토큰에서 objectId 가져와 컬렉션에서 user 찾아옴

*/