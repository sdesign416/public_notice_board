const postInput = document.getElementById("postInput")
const postList = document.getElementById("postList")
const addBtn = document.getElementById("addBtn")
const getMineBtn = document.getElementById("getMineBtn")

async function loadPosts() {
    try {
        token = localStorage.getItem("token")

        const response = await fetch("/post", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        const data = await response.json()

        renderPosts(data)

    } catch (error) {
        console.log("전체 포스트 조회 실패")
        renderPosts([])
    }

}

function renderPosts(posts) {
    userid = localStorage.getItem("userid")

    postList.innerHTML = ""
    const data = posts || []
    const postArray = Array.isArray(data) ? posts : Object.values(data)

    if (!Array.isArray(postArray)) {
        console.error("데이터 변환 실패:", postArray);
        return;
    }

    postArray.forEach((post) => {
        const li = document.createElement("li")
        let buttons = ""

        if(userid === post.userid){
            buttons = `
        <button class="updateBtn" data-id="${post._id}">수정</button>
        <button class="deleteBtn" data-id="${post._id}">삭제</button>
        `
        }

        li.innerHTML = `
        <span>${post.text}</span>
        <span>${post.createdAt}</span>
        <span>${post.userid}</span>
        ${buttons}
        `

        postList.appendChild(li)
    })
}

// 내 글 수정하기 삭제하기
postList.addEventListener("click",(event)=>{
    if (event.target.classList.contains("updateBtn")) {
        const id = event.target.dataset.id;

        updatePost(id)
    }

    if (event.target.classList.contains("deleteBtn")) {
        const id = event.target.dataset.id;
        console.log("삭제 클릭:", id);

        deletePost(id)
    }
    
    loadPosts()
})

//게시글 수정하기
async function updatePost(postid){
    const newText = prompt("수정할 내용을 입력하세요.")
    const token = localStorage.getItem("token")
    
    if (!newText || newText.trim() === "") return

    try{
        await fetch(`/post/${postid}`,{
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + token
            },
            body : JSON.stringify({text:newText})
        })

    }catch(error){
        console.log("포스트 수정 실패:",error)
    }
}

// 게시글 삭제하기
async function deletePost(postid){
    const check = confirm("정말 삭제하시겠습니까?")
    if (!check) return

    const token = localStorage.getItem("token")

    try{
        await fetch(`/post/${postid}`,{
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + token
            }
        })

    }catch(error){
        console.log("포스트 삭제 실패:",error)
    }
}


// 내가 쓴 게시글 가져오기
getMineBtn.addEventListener("click", async () => {

    try {
        userid = localStorage.getItem("userid")
        token = localStorage.getItem("token")   

        console.log(userid)
        console.log("/post?userid=" + userid)

        const response = await fetch("/post?userid=" + userid, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        const data = await response.json()

        renderPosts(data)

    } catch (error) {
        console.log("내 글 가져오기 오류")
    }

})

addBtn.addEventListener("click",async()=>{
    const text = postInput.value.trim()
    if(!text){
        alert("내용을 입력하세요")
        return
    }

    try{

        const response = await fetch("/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({text})
        })

        postInput.value=""
        loadPosts()

    }catch(error){
        console.log("포스트 추가 실패:",error)
    }
})

loadPosts()