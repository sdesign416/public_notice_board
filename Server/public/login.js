const loginInput = document.getElementById("loginInput")
const pwInput = document.getElementById("pwInput")
const nameInput = document.getElementById("nameInput")
const emailInput = document.getElementById("emailInput")

const loginBtn = document.getElementById("loginBtn")
const signBtn = document.getElementById("signBtn")


// 로그인 불러오기
loginBtn.addEventListener("click",async()=>{
    const userid = loginInput.value.trim()
    const password = pwInput.value.trim()


    if(!userid || !password){
        alert("아이디와 비밀번호를 입력하세요")
        return
    }
    try{
        const response = await fetch("/auth/login",{
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid,
                password
            })
        })

        if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.message || "응답없음")
        }

        const data = await response.json()

        loginInput.value=""
        pwInput.value = ""
        localStorage.setItem("token",data.token)
        localStorage.setItem("userid",data.user.userid)

        console.log("token: ",data.token)
        console.log("userid",data.user.userid)

        window.location.href = "/post/posts"

    }catch(error){
        console.log("로그인 오류",error)
    }
})

signBtn.addEventListener("click",async()=>{
    window.location.href = "/auth/signup"
})