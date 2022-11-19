const btn = document.querySelector('.button-prikol')
const place = document.querySelector('.placeholder')

function sendRequest(){
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/getPrikol')
    xhr.responseType = 'text'
    xhr.send()
    xhr.onload = function (){
        setPrikol(xhr.response);

    }
}

function setPrikol(src){
    place.innerHTML = ''
    const pic = document.createElement('img')
    pic.classList.add('pic')
    btn.classList.add('fixed')
    pic.src = src;
    place.append(pic)
}

btn.addEventListener('click', sendRequest)
