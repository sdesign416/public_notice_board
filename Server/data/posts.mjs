import MongoDB, { ObjectId, ReturnDocument } from "mongodb"
import * as UserRepository from "./auth.mjs"
import { getPosts } from "../db/database.mjs"

// 포스트를 작성
export async function create(title, content, image, id) {
    return UserRepository.findById(id).then((user) => getPosts().insertOne({
        title,
        content,
        image,
        createdAt: new Date(),
        idx: user.id,
        name: user.name,
        userid: user.userid,
        likes:[]
    })).then((result) => {
        return getPosts().findOne({ _id: result.insertedId })
    })
}

// 모든 포스트를 리턴
export async function getAll() {
    return getPosts().find().sort({ createdAt: -1 }).toArray()
}

// 사용자 아이디에 대한 포스트를 리턴
export async function getAllByUserid(userid) {
    return getPosts().find({ userid }).sort({ createdAt: -1 }).toArray()
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getById(postid) {
    return getPosts().find({ _id: new ObjectId(postid) }).next().then(mapOptionalPost)
}

// 미리보기
export async function getPreviewPosts() {
    return getPosts().find().sort({ createdAt: -1 }).limit(3).toArray()
}

// 포스트 정렬
export async function getSort(sort) {

    switch(sort){
        case "latest":
            return getPosts()
                .find()
                .sort({createdAt: -1})
                .toArray()
        case "oldest":
            return getPosts()
                .find()
                .sort({createdAt: 1})
                .toArray()
        case "like":
            return getPosts()
                .aggregate([
                    {$addFields:{likeCount: {$size: {$ifNull: ["$likes", []]}}}},
                    {$sort: {likeCount: -1, createdAt: -1}}
                ])
                .toArray()
    }
}

// 글 번호에 대한 포스트 수정
export async function update(title, content, image, postid) {
    return getPosts().findOneAndUpdate(
        { _id: new ObjectId(postid) },
        { $set: { title, content, image } },
        { ReturnDocument: "after" }
    ).then((result)=>result)
}

// 글 번호에 대한 좋아요 추가
export async function addLike(postid,userid){
    return getPosts().findOneAndUpdate(
        {_id: new ObjectId(postid)},
        { $push: { likes: userid } }, 
        { ReturnDocument: "after" }
    )
}

// 글 번호에 대한 좋아요 제거
export async function removeLike(postid,userid){
    return getPosts().findOneAndUpdate(
        {_id: new ObjectId(postid)},
        { $pull: { likes: userid } },
        { returnDocument: "after" }
    )
}

// 글 번호 포스트 삭제
export async function remove(postid) {
    return getPosts().deleteOne({ _id: new ObjectId(postid) })
}

function mapOptionalPost(post) {
    return post ? { ...post, id: post._id.toString() } : post
}