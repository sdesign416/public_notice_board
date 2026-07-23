import express from "express"
import * as postRepository from "../data/posts.mjs"
import { findById } from "../data/auth.mjs"


// 포스트를 작성하는 함수
export async function createPost(req, res) {
    try {
        const { title, content } = req.body

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: "제목과 내용을 입력해주세요."
            })
        }

        // 이미지가 있으면 접근 경로 저장
        const image = req.file ? `/uploads/posts/${req.file.filename}` : null

        // Repository 함수 형식에 맞게 각각 전달
        const post = await postRepository.create(
            title.trim(),
            content.trim(),
            image,
            req.id
        )

        return res.status(201).json(post)
    } catch (error) {
        console.error("포스트 작성 오류:", error)

        return res.status(500).json({
            message: "포스트 작성에 실패했습니다."
        })
    }
}

// 모든 포스트를 가져오는 함수
export async function getPosts(req, res) {
    // post?userid=apple 라서 userid를 query로 받아옴
    console.log("컨트롤러=======")
    const userid = req.query.userid
    const data = await (userid ? postRepository.getAllByUserid(userid) : postRepository.getAll())
    res.status(200).json(data)
}

// id로 포스트를 가져오는 함수
export async function getPost(req, res) {
    // post/:postid 라서 params로 postid 받아옴
    const postid = req.params.postid
    const post = await postRepository.getById(postid)

    if (post) {
        res.status(200).json(post)
    } else {
        res.status(404).json({ message: `${postid}의 포스트가 없습니다` })
    }
}

// 포스트를 정렬하는 함수
export async function sortsPost(req, res) {
    const sort = req.query.sort || "latest"
    const data = await postRepository.getSort(sort)
    if(!data){
        return res.status(404).json({message: `${sort} 정렬할 포스트가 없습니다`})
    }
    res.status(200).json(data)
    
}

// 포스트를 변경하는 함수
export async function updatePost(req, res) {
    const { postid } = req.params
    const { title, content } = req.body

    if (!title?.trim() || !content?.trim()) {
        return res.status(400).json({
            message: "제목과 내용을 입력해주세요."
        })
    }
    // 이미지가 있으면 접근 경로 저장
    const image = req.file ? `/uploads/posts/${req.file.filename}` : post.image

    const post = await postRepository.getById(postid)

    if (!post) {
        return res.status(404).json({ message: `${postid}의 포스트가 없습니다` })
    }
    if (post.idx !== req.id) {
        return res.sendStatus(403)
    }

    const updated = await postRepository.update(title.trim(), content.trim(), image, postid)
    res.status(200).json(updated)
}

// 포스트 좋아요를 수정하는 함수
export async function likePost(req,res) {
    const postid = req.params.postid
    const post = await postRepository.getById(postid)
    const userid = req.id

    if (!post) {
        return res.status(404).json({ message: `${postid}의 포스트가 없습니다` })
    }

    if (post.idx === req.id) {
        return res.sendStatus(403).json({ message: "본인 글에는 좋아요를 누를 수 없습니다." })
    }

    const likes = post.likes || []
    let updated
    if (likes.includes(req.id)){
        updated = await postRepository.removeLike(postid,req.id)
    }
    else{
        updated = await postRepository.addLike(postid,req.id)
    }

    res.status(200).json(updated)
}

// 포스트를 삭제하는 함수
export async function deletePost(req, res) {

    const postid = req.params.postid
    const post = await postRepository.getById(postid)

    if (!post) {
        return res.status(404).json({ message: `${postid}의 포스트가 없습니다` })
    }

    if (post.idx !== req.id) {
        return res.sendStatus(403)
    }

    await postRepository.remove(postid)
    res.sendStatus(204)
}