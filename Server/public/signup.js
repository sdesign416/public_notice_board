const userIdInput = document.getElementById("userIdInput")
const pwInput = document.getElementById("pwInput")
const nameInput = document.getElementById("nameInput")
const emailInput = document.getElementById("emailInput")

const signupBtn = document.getElementById("signupBtn")


//가입하기
signupBtn.addEventListener("click",async()=>{
    const userid = userIdInput.value.trim()
    const password = pwInput.value.trim()
    const name = nameInput.value.trim()
    const email = emailInput.value.trim()

    console.log("userid:",userid,"pw:",password,"name:",name,"email:",email)

    if(!userid || !password || !name || !email){
        alert("모든 정보를 입력하세요")
        return
    }
    try{
        const response = await fetch("/auth/signup",{
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid,
                password,
                name,
                email
            })
        })

        if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.message || "응답없음")
        }

        const data = await response.json()

        userIdInput.value=""
        pwInput.value = ""
        nameInput.value = ""
        emailInput.value = ""

        localStorage.setItem("token",data.token)
        localStorage.setItem("userid",data.user.userid)

        console.log("token: ",data.token)

    }catch(error){
        console.log("회원가입 오류",error)
    }
})
