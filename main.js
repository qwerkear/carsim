const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
//const car = new Car(road.getLaneCenter(3), 100, 30, 50, "AI", 5);
const N = 1000;
const initialCars = generateCars(N)
let bestCar = initialCars[0]
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i< initialCars.length; i++){
        initialCars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        )
        if(i!=0){
            NeuralNetwork.mutate(initialCars[i].brain,0.15) //adjust variability in cars
        }
    }
    
}


const initialTraffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),

]

const trafficController = new TrafficController(initialTraffic, bestCar)
const populationController = new CarPopulationController(initialCars, bestCar)

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    )
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N) {
    const cars = []
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function animate(time) {
    let traffic = trafficController.getTraffic()
    let cars = populationController.getPopulation()
    trafficController.update()
    populationController.update()
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic)
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    )

    trafficController.setCarToFollow(bestCar)
    populationController.setCarToFollow(bestCar)

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.5)

    road.draw(carCtx)
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "blue")
    }
    carCtx.globalAlpha = 0.2
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "red")
    }
    trafficController.draw(carCtx)
    populationController.draw(carCtx)
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, "red", true)


    //car.draw(carCtx, "black")

    carCtx.restore()

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}