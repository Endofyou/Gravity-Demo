const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const pi2 = 2 * Math.PI
const gConstant = 1.2e-6

let planets = [
  obj1 = {
    x: -200,
    y: 0,
    mass: 333060401,
    xSpeed: 0,
    ySpeed: 0,
    radius: 40,
    color: '#ffea00',
  },
  obj2 = {
    x: 240,
    y: 0,
    mass: 333060401 / 2,
    xSpeed: 0,
    ySpeed: 1.74,
    radius: 15,
    color: 'black',
  },
  obj3 = {
    x: 140,
    y: 0,
    mass: 333060401 / 2,
    xSpeed: 0,
    ySpeed: -0.26,
    radius: 15,
    color: 'white',
  },
]

let totalxMomentum = 0
let totalyMomentum = 0
for (let i = 1; i < planets.length; i++) {
  totalxMomentum += planets[i].xSpeed * planets[i].mass
  totalyMomentum += planets[i].ySpeed * planets[i].mass
}
planets[0].xSpeed = -1 * (totalxMomentum / planets[0].mass)
planets[0].ySpeed = -1 * (totalyMomentum / planets[0].mass)

const size = 8e2
const gap = 20
const rows = size / gap
let gridArray = []
for (let i = 0; i <= rows; i++) {
  gridArray[i] = []
  for (let j = 0; j <= rows; j++) {
    gridArray[i][j] = {
      x: i * gap - size / 2,
      y: j * gap - size / 2,
    }
  }
}

let recordTime = performance.now()
let formatTime = recordTime
let timeMult = 0

animate()

function animate() {
  //recordTime = performance.now()
  //timeMult = Math.min(4, 0.12 * (recordTime - formatTime))
  //formatTime = recordTime

  for (let i = 0; i < planets.length; i++) {
    for (let j = 0; j < planets.length; j++) {
      if (i != j) {
        const xDistance = planets[j].x - planets[i].x
        const yDistance = planets[j].y - planets[i].y
        const distance2 = xDistance ** 2 + yDistance ** 2
        const accel = (gConstant * planets[j].mass * timeMult) / distance2
        const angle = Math.atan2(yDistance, xDistance)

        planets[i].xSpeed += accel * Math.cos(angle)
        planets[i].ySpeed += accel * Math.sin(angle)
      }
    }
  }

  for (let i = 0; i < planets.length; i++) {
    planets[i].x += planets[i].xSpeed * timeMult
    planets[i].y += planets[i].ySpeed * timeMult
  }
  
  canvas.width = innerWidth
  canvas.height = innerHeight
  ctx.translate(canvas.width / 2, canvas.height / 2)

  drawBoard()
  drawPlanets()

  recordTime = performance.now()
  timeMult = Math.min(4, 0.12 * (recordTime - formatTime))
  formatTime = recordTime

  requestAnimationFrame(animate)
}

function drawBoard() {
  let curveArray = []
  const curvature = 0.003
  for (let i = 0; i <= rows; i++) {
    curveArray[i] = []
    for (let j = 0; j <= rows; j++) {
      curveArray[i][j] = {
        x: gridArray[i][j].x,
        y: gridArray[i][j].y,
      }
      let dx = 10
      let mag = []
      for (let k = 0; k < planets.length; k++) {
        const xVector = planets[k].x - curveArray[i][j].x
        const yVector = planets[k].y - curveArray[i][j].y

        mag[k] = curvature * planets[k].mass / (xVector ** 2 + yVector ** 2) / dx
      }
      iterate: for (let k = 0; k < dx; k++) {
        for (let l = 0; l < planets.length; l++) {
          if (checkDist(planets[l], curveArray[i][j]) < mag[l]) {
            curveArray[i][j].x = planets[l].x
            curveArray[i][j].y = planets[l].y

            break iterate
          } else {
            const angle = Math.atan2(planets[l].y - curveArray[i][j].y, planets[l].x - curveArray[i][j].x)

            curveArray[i][j].x += mag[l] * Math.cos(angle)
            curveArray[i][j].y += mag[l] * Math.sin(angle)
          }
        }
      }
    }
  }
  
  ctx.lineWidth = 2
  ctx.strokeStyle = '#333333'
  ctx.beginPath()
  for (let i = 0; i < curveArray.length; i++) {
    ctx.moveTo(curveArray[i][0].x, curveArray[i][0].y)
    for (let j = 1; j < curveArray[i].length; j++) {
      ctx.lineTo(curveArray[i][j].x, curveArray[i][j].y)
    }
  }
  for (let i = 0; i < curveArray[0].length; i++) {
    ctx.moveTo(curveArray[0][i].x, curveArray[0][i].y)
    for (let j = 1; j < curveArray.length; j++) {
      ctx.lineTo(curveArray[j][i].x, curveArray[j][i].y)
    }
  }
  ctx.stroke()
}

function drawPlanets() {
  for (let i = 0; i < planets.length; i++) {
    ctx.beginPath()
    ctx.arc(planets[i].x, planets[i].y, planets[i].radius, 0, pi2)
    ctx.fillStyle = planets[i].color
    ctx.fill()
  }
}

function checkDist(obj1, obj2) {
  return Math.sqrt(
    (obj1.x - obj2.x) ** 2 +
    (obj1.y - obj2.y) ** 2
  )
}
