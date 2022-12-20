const btn = document.querySelector('.button-prikol')
const place = document.querySelector('.placeholder')
const feedback = document.querySelector('.feedback')

const likeInfo = document.querySelector('.like_info')
const dislikeInfo = document.querySelector('.dislike_info')

function sendRequest(){
    fetch('/getPrikol')
      .then(response => response.json())
      .then(text => {
        setPrikol(text[0])
        picName = text[0]
        likeInfo.innerHTML = text[1]
        dislikeInfo.innerHTML = text[2]
      })
      
}

let picName = ''

function setPrikol(src){
    place.innerHTML = ''
    const pic = document.createElement('img')
    pic.classList.add('pic')
    feedback.classList.add('fixed')
    pic.src = src;
    place.append(pic)
}

btn.addEventListener('click', () => {
    sendRequest()
    feedback.classList.add('fixed')
    feedbckButtons.forEach(value => value.classList.remove('hiden'))
    feedbckButtons.forEach(value => value.classList.remove('inactive'))
    dislikeBtn.classList.remove('hiden')
    likeBtn.classList.remove('hiden')
})

const feedbckButtons = document.querySelectorAll('.feedback_button')
const dislikeBtn = document.querySelector('.dislike')
const likeBtn = document.querySelector('.like')

async function sendVote(picName, vote){
    if (localStorage.getItem('tokens') != null) {
        const request = {
            picName: picName,
            vote: vote,
            accesToken: getTokens().access
        }
        const f = await fetch('/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(request)
        })
        const data = await f.json()
        if (f.ok) {
            dislikeInfo.innerHTML = data[1]
            likeInfo.innerHTML = data[0]
        } else {
            getNewTokens()
            const request = {
                picName: picName,
                vote: vote,
                accesToken: getTokens().access
            }
            const f = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(request)
            })
            const data = await f.json()
            dislikeInfo.innerHTML = data[1]
            likeInfo.innerHTML = data[0]

        }
    }   else {
        open(popUp)
    }
}

likeBtn.addEventListener('click', () => {
    if (!likeBtn.classList.contains('inactive')){
        sendVote(picName, 'like')
        feedbckButtons.forEach(value => value.classList.add('inactive'))
    } 
})

dislikeBtn.addEventListener('click', () => {
    if (!likeBtn.classList.contains('inactive')){
        sendVote(picName, 'dislike')
        feedbckButtons.forEach(value => value.classList.add('inactive'))
    } 
})

//Меню
const menuBtn = document.querySelector('.menu-btn')

const menuNav = document.querySelector('.menu-nav')

menuBtn.addEventListener('click', () => {
    if (menuBtn.classList.contains('menu-btn_active')){
        menuBtn.classList.remove('menu-btn_active')
        menuNav.classList.remove('menu-nav__active')
    } else {
        menuBtn.classList.add('menu-btn_active')
        menuNav.classList.add('menu-nav__active')
    }

})
//Вход


const popUp = document.querySelector('.pop-up')
const logBtn = document.getElementById('login').addEventListener('click', () => {
    popUp.classList.remove('hiden')
    popUp.classList.add('show')
})
const closelog = document.querySelector('.pop-up-body-signin-close')
  .addEventListener('click', () => close(popUp))

const popUpBg = document.querySelector('.pop-up__bg').addEventListener('click', () => close(popUp))
const signInForm = document.querySelector('#signin_form')

signInForm.addEventListener('submit', () => {
    signIn()
})
//Контакты


const contacts = document.querySelector('.pop-up_cont')

const contBtn = document.getElementById('contacts')
const contBg = document.querySelector('.pop-up_contacts__bg')
contBtn.addEventListener('click', () => {
   open(contacts)
})

contBg.addEventListener('click', () => close(contacts))

const contClose = document.querySelector('.pop-up_contacts_close')
  .addEventListener('click', () => close(contacts))
//Регистрация

const regPopUp = document.querySelector('.pop-up-reg')

const regLink = document.getElementById('regLinkBtn').addEventListener('click', () => {
    close(popUp)
    open(regPopUp)
})
const regForm = document.getElementById('signup_form')

regForm.addEventListener('submit', () => {
    document.querySelector('.reg__ok').classList.remove('hiden')
    signUp()
})

const regClose = document.getElementById('reg_close').addEventListener('click', () => {
    close(regPopUp)
})



//При запуске
window.onload = () => {
    checkTokens()
}


//Функции


function close(name){
    name.classList.remove('show')

    name.classList.add('hiden')
}
function open(name){
    name.classList.add('show')
    name.classList.remove('hiden')
}
document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" &&
      (popUp.classList.contains('show')
        || contacts.classList.contains('show') || regPopUp.classList.contains('show'))) {
        close(popUp)
        close(contacts)
        close(regPopUp)
    }
});

async function signIn(){
    const login = document.querySelector('#signin_login')
    const pass = document.querySelector('#signin_pass')

    const userInfo = {
        userName: login.value,
        password: pass.value
    }

    const request = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userInfo)
    })
    const data = await request.json()

    if (request.ok){
        window.location.reload()
        setToken(data.accessToken, data.refreshToken)
    } else if(request.status === 404) {
        errSignIn(404)
    } else if(request.status === 409){
        errSignIn(409)
    }
}

async function signUp(){
    const login = document.querySelector('#signup_login')
    const pass = document.querySelector('#signup_pass')

    const userInfo = {
        userName: login.value,
        password: pass.value
    }

    const request = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userInfo)
    })
    const data = await request.json()

    if (request.ok){
        window.location.reload()
        setToken(data.accessToken, data.refreshToken)
    } else if (request.status === 409){
        errSignUp(409)
    }
}

function setToken(access, refresh){
    localStorage.clear()
    const tokens = {
        access: access,
        refresh: refresh
    }
    localStorage.setItem('tokens', JSON.stringify(tokens))
}

function getTokens(){
    const tokens = localStorage.getItem('tokens')
    return JSON.parse(tokens)
}

async function checkTokens(){
    const accessInfo = {
        'accessToken': getTokens().access
    }
    const f = await fetch('/checkToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(accessInfo)
    })
    const data = await f.text()
    if (f.ok){
        changeLogBtn()
        return true
    } else {
        window.location.reload()
        getNewTokens()
        return false
    }
}

async function getNewTokens(){
    const refreshInfo = {
        'refreshToken' : getTokens().refresh
    }
    const newF = await fetch('/getaccesstoken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(refreshInfo)
    })
    const d = await newF.json()
    setToken(d.accessToken, d.refreshToken)
}

function errSignIn(code){
    const login = document.querySelector('#signin_login')
    const pass = document.querySelector('#signin_pass')

    if (code === 409){
        pass.value = ''
        pass.placeholder = 'Неверный пароль'
        pass.style.border = '1px solid #ff0e0e'
    } else if (code === 404){
        login.value = ''
        login.placeholder = 'Такого пользователя нет'
        login.style.border = '1px solid #ff0e0e'
        pass.value = ''
    }
}

function errSignUp(code){
    const login = document.querySelector('#signup_login')
    const pass = document.querySelector('#signup_pass')

    if (code === 409){
        login.value = ''
        login.placeholder = 'Такой пользователь уже есть'
        login.style.border = '1px solid #ff0e0e'
        pass.value = ''
    }
}

function changeLogBtn(){
    const logInBtn = document.getElementById('login')
    const logOutBtn = document.createElement('div')
    logOutBtn.classList.add('menu-nav__link')
    logOutBtn.id = 'logout'
    logOutBtn.innerText = 'Выйти'
    logOutBtn.addEventListener('click', () => logOut())
    const parentNode = document.querySelector('.menu-nav')
    parentNode.replaceChild(logOutBtn, logInBtn)
}

function logOut() {
  const logOutChose = document.querySelector('.log-out')
  open(logOutChose)
  const logOutYes = document.getElementById('log-out-yes')
  logOutYes.addEventListener('click', () => {
    localStorage.removeItem('tokens')
    window.location.reload()
  })
  const logOutNope = document.getElementById('log-out-nope')
  logOutNope.addEventListener('click', () => close(logOutChose))
}
