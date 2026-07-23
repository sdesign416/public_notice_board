import express from "express"
import * as authRepository from "../data/auth.mjs"
import * as bcrypt from "bcrypt"
import { config } from "../config.mjs"
import jwt from "jsonwebtoken"

// 회원가입
export async function signup(req, res) {
    const { userid, password, name, email } = req.body
    // 회원 중복 체크
    const found = await authRepository.findByUserid(userid)
    if (found) {
        return res.status(409).json({ message: `${userid}이 이미 있습니다` })
    }
    const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds)//동기식 처리

    // 회원 가입
    const user = await authRepository.createUser({
        userid, password: hashed, name, email
    })
    console.log(user)

    const token = await createJwtToken(user._id)
    console.log(token)
    res.status(201).json({ token, user })
}

// 로그인
export async function login(req, res) {
    const { userid, password } = req.body
    const user = await authRepository.findByUserid(userid)
    if (!user) {
        return res.status(401).json({ message: "아이디 또는 비밀번호 확인" })
    }
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        return res.status(401).json({ message: "아이디 또는 비밀번호 확인" })
    }

    const token = await createJwtToken(user.id)
    res.status(200).json({ token, user })
}

// 로그인 유지
export async function me(req, res) { //헤더 통해 처리하려고 req,res 받음
    const user = await authRepository.findById(req.id) // isAuth에서 토큰을 통해 userid 찾아 req.id에 넣어줌
    if (!user) {
        return res.status(404).json({ message: "일치하는 사용자가 없음" })
    }
    res.status(200).json({ token: req.token, userid: user.userid, user_id : user._id })
}

async function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec
    })
}