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
})

const feedbckButtons = document.querySelectorAll('.feedback_button')
const dislikeBtn = document.querySelector('.dislike')
const likeBtn = document.querySelector('.like')

function sendVote(picName, vote){
    const request = {
        picName: picName,
        vote: vote
    }
    fetch('/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request)
      
    })
      .then(response => response.json())
      .then(text => {
        dislikeInfo.innerHTML = text[1]
        likeInfo.innerHTML = text[0]
      })
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

function close(name){
    name.classList.remove('show')
    name.classList.add('hiden')
}
function open(name){
    name.classList.add('show')
    name.classList.remove('hiden')
}

const popUp = document.querySelector('.pop-up')
const logBtn = document.getElementById('login').addEventListener('click', () => {
    popUp.classList.remove('hiden')
    popUp.classList.add('show')
})
const closelog = document.querySelector('.pop-up-body-signin-close')
  .addEventListener('click', () => close(popUp))

const popUpBg = document.querySelector('.pop-up__bg').addEventListener('click', () => close(popUp))

document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" &&
      (popUp.classList.contains('show')
        || contacts.classList.contains('show'))) {
        close(popUp)
        close(contacts)
    }
});

const contacts = document.querySelector('.pop-up_cont')
const contBtn = document.getElementById('contacts')
const contBg = document.querySelector('.pop-up_contacts__bg')

contBtn.addEventListener('click', () => {
   open(contacts)
})

contBg.addEventListener('click', () => close(contacts))

const contClose = document.querySelector('.pop-up_contacts_close')
  .addEventListener('click', () => close(contacts))