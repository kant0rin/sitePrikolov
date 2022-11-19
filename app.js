const btn = document.querySelector('.button-prikol')
const place = document.querySelector('.placeholder')

function setPrikol(src){
    place.innerHTML = ''
    const pic = document.createElement('img')
    pic.classList.add('pic')
    pic.src = src
    place.append(pic)
}

btn.addEventListener('click', () => {
    setPrikol('xuy.jpg')
    btn.classList.add('fixed')
})
