// Array.from(document.querySelectorAll("input")).forEach((elem) => {
//     elem.onclick = () => {
//         alert("Hey!! No cheating is allowed")
//         window.location.reload()
//     }
// })


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rows = Array.from(document.querySelectorAll(".tiles")).map((el) => [parseInt(el.className.split("row-")[1]), Array.from(el.querySelectorAll("input"))])
var snakePartsCount = 0
var apples = [
    [15, 18],
    [15, 25],
    [15, 30]
]

const snake = {
    x: 15,
    y: 15,
    oldX: 15,
    oldy: 15,
    direction: "down",
    oldDirection: "down",
    snakeparts: {}
}



const resetApples = () => {
    if (apples.length == 0) {
        for (let i of Array(getRandomInt(1, 4))) {
            apples.push([getRandomInt(0, 31), getRandomInt(0, 31)])
        }
    }
}
resetApples()


const createSnakePart = (x, y, direction) => {
    let previousPart = snake
    for (let i=0; i < snakePartsCount; i++) {
        previousPart = snake.snakeparts
    }
    if (previousPart == undefined) {
        return
    }
    snakePartsCount++
    previousPart.snakeparts = {
        x: parseInt(x),
        y: parseInt(y),
        oldx: parseInt(x),
        oldy: parseInt(y),
        direction: `${direction}`,
        oldDirection: `${direction}`
    }
}

const toggleCheck = (x, y, checked=true, isApple=false) => {
    for (let row of rows) {
        if (row[0] == y) {
            for (let index=0; index < row[1].length; index++) {
                let checkmark = row[1][index]
                if (index == x) {
                    checkmark.checked = checked
                    if (isApple && checked) {
                        checkmark.style.accentColor = "red"
                    } else if (checked){
                        if (checkmark.style.accentColor == "red") {
                            console.log(`%c[Snake] %cAte an apple!`, "color: green", "color: black")
                            console.log(`%c[Snake] %c${JSON.stringify(
                                snake,
                                null,
                                2
                            )}`, "color: green", "color: black")
                            apples = apples.filter((apple) => `${apple[0]}, ${apple[1]}` != `${x}, ${y}`)
                        }
                        checkmark.style.accentColor = "green"
                    } else {
                        checkmark.removeAttribute("style")
                    }
                    break
                }
            }
            break
        }
    }
}

toggleCheck(snake.x, snake.y)


const updateXY = (snakePart) => {
    switch (snakePart.direction) {
        case "right":
            snakePart.oldX = parseInt(snakePart.x)
            snakePart.x += 1
            if (snakePart.x > 31) {
                snakePart.x = 0
            }
            break;
    
        case "left":
            snakePart.oldX = parseInt(snakePart.x)
            snakePart.x -= 1
            if (snakePart.x < 0) {
                snakePart.x = 31
            }
            break
        
        case "up":
            snakePart.oldy = parseInt(snakePart.y)
            snakePart.y -=1
            if (snakePart.y < 0) {
                snakePart.y = 31
            }
            break
        
        case "down":
            snakePart.oldy = parseInt(snakePart.y)
            snakePart.y  += 1
            if (snakePart.y > 31) {
                snakePart.y = 0
            }
            break
    }

    switch (snakePart.direction) {
        case "right":
            toggleCheck(snakePart.oldX, snakePart.oldy, false)
            toggleCheck(snakePart.x, snakePart.y)
            break;

        case "left":
            toggleCheck(snakePart.oldX, snakePart.oldy, false)
            toggleCheck(snakePart.x, snakePart.y)
            break;
    
        case "up":
            toggleCheck(snakePart.oldX, snakePart.oldy, false)
            toggleCheck(snakePart.x, snakePart.y)
            break;
        
        case "down":
            toggleCheck(snakePart.oldX, snakePart.oldy, false)
            toggleCheck(snakePart.x, snakePart.y)
            break;
    }

    if (snakePart.direction != snakePart.oldDirection) {
        if ((snakePart.direction == "right") && (snakePart.oldDirection == "down")) {
            toggleCheck(snakePart.x )
        }
    }
}

// player controls
document.addEventListener('keyup', (e) => {
    switch (true) {

        case ["ArrowRight", "D", "d"].includes(e.key): {
            snake.direction = "right"
            break
        }

        case ["ArrowLeft", "A", "a"].includes(e.key): {
            snake.direction = "left"
            break
        }

        case ["ArrowUp", "W", "w"].includes(e.key): {
            snake.direction = "up"
            break
        }

        case ["ArrowDown", "S", "s"].includes(e.key): {
            snake.direction = "down"
            break
        }

        default:
            // console.log(e.key)
            break;
    }
})

const update = () => {
    if (apples.length != 0) {
        apples.forEach((apple) => {
            toggleCheck(apple[0], apple[1], true, true)
        })
    }

    let previousPart = snake

    for (let i=0; i < snakePartsCount+1; i++) {
        if (previousPart != undefined) {
            updateXY(previousPart)
            previousPart = previousPart.snakeparts
        }
    }
}

setInterval(update, 250)