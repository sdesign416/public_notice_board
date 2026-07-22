import multer from "multer"
import path from "path"
import fs from "fs"

// 파일 저장 경로
const uploadPath = path.resolve("public", "uploads", "posts")

// 폴더 없으면 자동 생성
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath, {recursive: true})
}

// 파일 저장방식 설정
const storage = multer.diskStorage({ // 서버 폴더(디스크)에 서장
    // 폴더 설정: callback=저장위치 알려줌
    destination: (req, file, callback) => {
        // 정상이면 null = 오류없다는 뜻
        // uploadPath = 저장할 폴더
        callback(null, uploadPath)
    },

    // 파일 이름 설정
    filename: (req, file, callback) => {
        // 원본 파일 확장자 추출
        const extension = path.extname(file.originalname)
        // 현재 시간으로 파일명 지정
        // ${Math.round(Math.random() * 1e9)} : 같은 시간대 등록하는 파일 충돌 방지위해 시간과 난수 사용함
        const filename = `${Date.now()}_${Math.round(Math.random() * 1e9)}${extension}`

        callback(null, filename)
    }
})


// 업로드 미들웨어
export const uploadPostImage = multer({
    storage, // 저장 방식 설정
    limits: {fileSize: 5 * 1024 * 1024}, // 최대 파일 크기
    
    // 업로드 파일 검사
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")){
            callback(null, true) // 통과, 업로드 허용
        }else{
            callback(
                new Error("이미지파일만 업로드 가능합니다."), false
            )
        }
    }
})