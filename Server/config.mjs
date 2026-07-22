import dotenv from "dotenv"

dotenv.config() // .env 내용을 load

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue // process.env : 현재 프로세스의 환경변수에 접근할 수 있게 해주는 객체
    // .env : 설정값 저장 보관함 process.env : Node.js가 실행될 때 운영체제로부터 받아오는 전역 환경 설정 객체
    if (value == null) {
        throw new Error(`키 ${key}는 undefined`)
    }
    return value
}

export const config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC"))
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 10))
    },
    host: {
        port: parseInt(required("HOST_PORT", 8080))
    },
    db: {
        host: required("DB_HOST")
    }
}