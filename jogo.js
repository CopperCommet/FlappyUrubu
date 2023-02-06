// Aqui teremos a programação do Flappy Bird :D
const sprites = new Image()
sprites.src = "sprites.png"
const canvas = document.querySelector("#game-canvas")
const contexto = canvas.getContext("2d")

const punch = new Audio()
const wing = new Audio()
const point = new Audio()
const die = new Audio()
const mus1 = new Audio()
const mus2 = new Audio()
const mus3 = new Audio()
punch.src = "./audio/punch.wav"
wing.src = "./audio/sfx_wing.mp3"
point.src = "./audio/sfx_point.mp3"
die.src = "./audio/sfx_die.mp3"
mus1.src = "./audio/mus1.mp3"
mus2.src = "./audio/mus2.mp3"
mus3.src = "./audio/mus3.mp3"
songs = [mus1, mus2, mus3]
lsong = null
song = null
ft = null

const start = {
    spriteX: 130,
    spriteY: 0,
    largura: 180,
    altura: 152,
    x: 70,
    y: 70,
    v: 1,
}
const end = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: 50,
    y: 70,
    v: 1,
}
const background = {
    spriteX: 392,
    spriteY: 0,
    largura: 274,
    altura: 204,
    x: 0,
    y: 180,
    v: 3,
}
const pipeG = {
    spriteX: 0,
    spriteY: 169,
    largura: 52,
    altura: 400,
    x: 320,
    y: 270,
    v: 1,
    vel: 3.5,
    ran: 0,
    rana: 0,
    ppipes: [],
}
const pipeS = {
    spriteX: 52,
    spriteY: 169,
    largura: 52,
    altura: 400,
    x: 320,
    y: -240,
    v: 1,
}
const ground = {
    spriteX: 0,
    spriteY: 611,
    largura: 223.5,
    altura: 112,
    x: 0,
    y: 370,
    v: 2,
}
const medal = {
    spriteX: 0,
    spriteY: 77,
    largura: 44,
    altura: 45,
    x: 75,
    y: 156,
    v: 1,
}
const urubu = {
    spriteX: 0,
    spriteY: 26,
    largura: 35,
    altura: 25,
    x: 10,
    y: 50,
    v: 1,
    gra: 0.25,
    vel: 0,
    framestate: 0,
    score: 0,
    lscore: 0,
    frames: [
        {spriteX: 0, spriteY: 0,},
        {spriteX: 0, spriteY: 26,},
        {spriteX: 0, spriteY: 52,},
        {spriteX: 0, spriteY: 26,},
    ]
}
const startscreen = {
    objects: [background, ground, urubu, start],
    update(){
        desenha(activescreen.objects)
    },
    click(){
        if (ft == null){
            ft = 1
            songplay()
        }
        pipeG.ppipes.push(JSON.parse(JSON.stringify(pipeG)), JSON.parse(JSON.stringify(pipeS)))
        pipeG.ran = parseInt(Math.random() * (150 - (0) + 1))
        activescreen = gamescreen
    }
}
const gamescreen = { 
    bg: [background],
    objects: [ground, urubu],
    update(){
        if(colides()){
            punch.play()
            activescreen = endscreen
            urubu.vel = -6
            if (urubu.score > urubu.lscore){
                urubu.lscore = urubu.score
            }
            if (urubu.score >= 50){
                medal.spriteX = 0
                medal.spriteY = 124
            } else if (urubu.score <= 49 && urubu.score >= 30){
                medal.spriteX = 48
                medal.spriteY = 77
            } else if (urubu.score <= 29 && urubu.score >= 10){
                medal.spriteX = 48
                medal.spriteY = 124
            } else{
                medal.spriteX = 0
                medal.spriteY = 77
            }
            die.play()
            return
        }
        if(urubu.vel == 0){
            urubu.framestate = 1
        }else if (urubu.vel > 0){
            urubu.framestate = 0
        }else if (urubu.vel < 0){
            urubu.framestate = 2
        }
        if(ground.x <= -98){
            ground.x = 0
        }
        if(background.x <= -274){
            background.x = 0
        }
        urubu.vel += urubu.gra
        urubu.y += urubu.vel
        urubu.spriteY = urubu.frames[urubu.framestate].spriteY 
        background.x -= 1.5
        ground.x -= pipeG.vel
        ran = parseInt(Math.random(0)* 50)
        pipeup(ran)
        desenha(activescreen.bg)
        desenha(pipeG.ppipes)
        desenha(activescreen.objects)
    },
    click(){
        urubu.vel = -4
        wing.play()
    },
}
const endscreen = {
    bg: [background],
    objects: [ground, urubu, end, medal],
    update(){
        if (urubu.y < 490){
            urubu.vel += urubu.gra
            urubu.y += urubu.vel
            urubu.x += 2
        }
        desenha(activescreen.bg)
        desenha(pipeG.ppipes)
        desenha(activescreen.objects)
        contexto.font = (fonte + "px ") + '"Comic Neue"'
        contexto.textAlign = 'center'
        contexto.fillStyle = 'black'
        contexto.fillText(urubu.score, (235*sizel)/320, (165*sizea)/480)
        contexto.font = (fonte + "px ") + '"Comic Neue"'
        contexto.textAlign = 'center'
        contexto.fillStyle = 'black'
        contexto.fillText(urubu.lscore, (235*sizel)/320, (205*sizea)/480)
    },
    click(){
        gamereset()
    }
}

function desenha(param) {
    for (par in param) {
        xa = (param[par].x*sizel)/320
        ya = (param[par].y*sizea)/480
        for (i=0;i<param[par].v;i++){
            contexto.drawImage(
                sprites,
                param[par].spriteX, param[par].spriteY,
                param[par].largura, param[par].altura,
                ((param[par].x + i*(param[par].largura))*sizel)/320 , ya,
                (param[par].largura*sizel)/320, (param[par].altura*sizea)/480,
            )
        }
    }
}
function gamestart(){
    activescreen.click()
}
function keypress(event){
    if (event.key == "r" && activescreen == gamescreen){
        gamereset()
    }
}
function gamereset(){
    activescreen = startscreen
    urubu.vel = 0
    urubu.y = 50
    urubu.x = 10
    urubu.spriteX = 0
    urubu.spriteY = 26 
    urubu.score = 0
    ground.x = 0
    background.x = 0
    pipeG.y = 270
    pipeS.y = -240
    pipeG.ppipes = []
    pipeG.vel = 3.5
}
function colides(){
    if (urubu.y >= 345){
        return (true)
    }
    for (i in pipeG.ppipes){
        if (
            urubu.x + urubu.largura -1 >= pipeG.ppipes[i].x && urubu.x + urubu.largura -1 <= pipeG.ppipes[i].x + pipeG.largura ||
            urubu.x >= pipeG.ppipes[i].x && urubu.x <= pipeG.ppipes[i].x + pipeG.largura ){
            if (
                urubu.y >= pipeG.ppipes[i].y && urubu.y <= pipeG.ppipes[i].y + pipeG.altura ||
                urubu.y + urubu.altura >= pipeG.ppipes[i].y && urubu.y + urubu.altura <= pipeG.ppipes[i].y + pipeG.altura
                ){
                return(true)
            }
        }
        if (urubu.x >= pipeG.ppipes[i].x + pipeG.largura && urubu.x <= pipeG.ppipes[i].x + pipeG.largura + pipeG.vel){
            point.play()
            urubu.score += 0.5
            if (urubu.score % 5 == 0){
                pipeG.vel += 0.5
                background.x += 0.2
            }
        }
    }
}
function pipeup(){
    if (pipeG.ppipes[0].x <= -52){
        pipeG.ppipes.shift(0,1)
    }
    if (pipeG.y <= 200 || pipeG.y >= 340){
        pipeG.y = 270
        pipeS.y = -240
    }
    if (pipeG.ppipes[(pipeG.ppipes.length) - 1].x <= pipeG.ran){
        pipeG.y += -1*(pipeG.rana)
        pipeS.y -= pipeG.rana
        pipeG.ppipes.push(JSON.parse(JSON.stringify(pipeG)), JSON.parse(JSON.stringify(pipeS)))
        pipeG.ran = parseInt(Math.random() * (150 - (0) + 1))
        pipeG.rana = parseInt(Math.random() * (30 - (-30) + 1) -30)

    }
    for (i in pipeG.ppipes){
        pipeG.ppipes[i].x -= pipeG.vel
    }
}
function songplay(){
    song = parseInt(Math.random() * (2 - (0) + 1))
    if (song == lsong){
        songplay()
        return
    } else {
        lsong = song
        songs[song].play()
        songs[song].addEventListener("ended", songplay)
        return
    }
}
function loop(){
    sizea = window.innerHeight
    sizel = (320*sizea)/480
    proporcao = sizea/sizel
    canvas.width = String(sizel)
    canvas.height = String(sizea)
    contexto.fillStyle = "#70c5ce"
    contexto.fillRect(0,0, canvas.width, canvas.height)
    activescreen.update()
    fonte = 35*sizel/480
    contexto.font = (fonte + "px ") + '"Comic Neue"'
    contexto.textAlign = 'center'
    contexto.fillStyle = 'white'
    contexto.fillText(urubu.score, (160*sizel)/320, (40*sizea)/480)
    requestAnimationFrame(loop)
}
window.addEventListener("click", gamestart)
window.addEventListener("keypress", keypress)
activescreen = startscreen
loop()