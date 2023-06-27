const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('span')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')


let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;


let timeStart;
let timePlayer;
let timeInterval;

const playerPosition= {
    x:undefined,
    y:undefined,
}

const giftPosition = {
    x:undefined,
    y:undefined,
}


let enemyPositions =[

];

window.addEventListener('load', setCanvasSize);
window.addEventListener('risize', setCanvasSize);


function setCanvasSize(){

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8
        
    }else{
        canvasSize = window.innerHeight * 0.8;
    }
     
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height',canvasSize);


     elementsSize = (canvasSize / 10) ;

    startGame()
}

function startGame (){

    game.font= elementsSize + 'px Verdana';
    game.textAlign= "end"

    const map = maps[level];
        if(!map){
            gameWin()
            return;
        }

        if(!timeStart){
            timeStart = Date.now();
            timeInterval = setInterval(showTime, 100);
            showRecord();
        }


    const mapRows = map.trim().split('\n')
    const mapRowCols = mapRows.map(row => row.trim().split(''));

     showLives()   


    enemyPositions = []
    game.clearRect(0,0, canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI)  => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
           const posX = elementsSize * (colI +1.2);
           const posY = elementsSize * (rowI +0.9);


             if(col == 'O'){
                if  (!playerPosition.x && !playerPosition.y){
                 playerPosition.x = posX;
                 playerPosition.y = posY;
                }
                     }else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
                        } else if (col == 'X'){
                            enemyPositions.push({
                                x: posX,
                                y: posY,
                            });
                        }
            game.fillText(emoji,  posX , posY)
            });
           
        });
        movePlayer()
    };
   



function movePlayer(){
    const  gitfCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const  gitfCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = gitfCollisionX && gitfCollisionY;

    if(giftCollision){
       levelWin()
    }

    const enemyCollision = enemyPositions.find(enemy => {
     const enemyCollisionX =  enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
     const enemyCollisionY =  enemy.y.toFixed(3) == playerPosition.y.toFixed(3);

     return enemyCollisionX && enemyCollisionY;
    });

    if(enemyCollision){
       levelFail()
    }

    game.fillText(emojis['PLAYER'],
     playerPosition.x , 
     playerPosition.y
     )

};

function levelWin (){
    level++
    startGame();
}

function levelFail(){

    lives--;
    if(lives  <= 0){             
        level = 0; 
        lives = 3;      
        timeStart= undefined;  
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    
    startGame();
}


function gameWin(){
    clearInterval(timeInterval);

 const recordTime =   localStorage.getItem('record_time');
 const playerTime = Date.now() - timeStart;


 if(recordTime){
    if(recordTime >= playerTime){
        localStorage.setItem('record_time', playerTime)
      pResult.innerHTML=('superaste el record CAMPEON')
    }else{
        pResult.innerHTML=('no superaste el record')
    }
 }else{
    localStorage.setItem('record_time', playerTime)
    pResult.innerHTML='Primera vez? Deja un buen tiempo'
 }


}

function showLives(){
  const heartsArray =  Array(lives).fill(emojis['HEART']) // [1,2,3];

    spanLives.innerHTML ="";
    heartsArray.forEach(heart => spanLives.append(heart));
}


function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}






window.addEventListener('keydown', moveByKeys);

btnUp.addEventListener('click', moveUp);

btnLeft.addEventListener('click', moveLeft);

btnRight.addEventListener('click', moveRight);

btnDown.addEventListener('click' , moveDown);

function moveByKeys(event){
    if(event.key == 'ArrowUp'){
        moveUp();
    }else if(event.key == 'ArrowLeft'){
        moveLeft();
    } else if( event.key == 'ArrowRight'){
        moveRight();
    }else if (event.key == 'ArrowDown'){
        moveDown();
    }
}


function moveUp (){
    if((playerPosition.y - elementsSize) < 0){
       
    }else{
        playerPosition.y -= elementsSize
    startGame()
    }
   
}

function moveLeft (){
    if((playerPosition.x - elementsSize) < elementsSize){
    console.log('OUT')
    }else{
        playerPosition.x -= elementsSize
    startGame()
    }

}

function moveRight (){
    if((playerPosition.x + elementsSize) > canvasSize+40){
       
        }else{
            playerPosition.x += elementsSize
        startGame()
        }

}

function moveDown (){
    if(( playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT')
        }else{
            playerPosition.y += elementsSize
        startGame()
        }
        

}