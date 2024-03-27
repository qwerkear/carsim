class TrafficController {
    constructor(traffic, carToFollow) {
        this.traffic = traffic

        this.carToFollow = carToFollow
        this.x = carToFollow.x
        this.y = carToFollow.y + 100
        this.width = 50
        this.height = 30
        this.cycle = 0
    }

    getTraffic = () => {
        return this.traffic
    }

    getTrafficDistance(){
        return this.traffic[5].y 
    }

    setCarToFollow(c){
        this.carToFollow = c
    }


    update() {
        this.y = this.carToFollow.y - 400 //stay 400 units ahead of the following car
        if(this.y - this.traffic[5].y < -800){
            this.recycleTraffic()
            console.log(this.cycle)
        }
    }

    

    recycleTraffic() {
        let space = 150
        this.swapTraffic()
        for(let i = 0; i < this.traffic.length; i++){
            this.traffic[i].y = this.y - space
            space = space + 150
        }
        this.cycle++
    }

    swapTraffic(){
        const trafficSize = this.traffic.length
        let index1 = 0
        let index2 = 0
        while(index1 == index2){
            index1 = Math.floor(Math.random() * trafficSize)
            index2 = Math.floor(Math.random() * trafficSize)
        }
        const temporaryCar = this.traffic[index1]
        this.traffic[index1] = this.traffic[index2]
        this.traffic[index2] = temporaryCar
    }

    draw(ctx, color = "black") {

        ctx.fillStyle = color

        ctx.beginPath()
        ctx.rect(
            this.x-this.width/2,
            this.y-this.height/2,
            this.width,
            this.height)
        ctx.fill()


    }
}