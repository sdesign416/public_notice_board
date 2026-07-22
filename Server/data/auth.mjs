import MongoDB from "mongodb"
import { getUsers } from "../db/database.mjs"

const ObjectId = MongoDB.ObjectId

export async function findByUserid(userid) {
    return getUsers().find({ userid }).next().then(mapOptionalUser)
}

export async function createUser(user) {
    //return getUsers().insertOne(user).then((result) => result.insertedId.toString()) // insertedId : 데이터 삽입 후 db가 생성한 ObjectId
    const result = await getUsers().insertOne(user)
    return getUsers().findOne({ _id: result.insertedId })
}
export async function findById(id){
    return getUsers().find({_id: new ObjectId(id)}).next().then(mapOptionalUser)
}

function mapOptionalUser(user) {
    return user ? { ...user, id: user._id.toString()} : user // ObjectId 타입인 _id를 String 타입으로 바꿔서 반환
    // db에 저장된 user 정보를 건드리지 않기 위해
    // 스프레드 문법으로 _id 제외한 나머지는 그대로 유지. _id만 string으로 변환
}