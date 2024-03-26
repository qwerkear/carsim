class TrafficController {
    constructor(traffic, carToFollow) {
        this.traffic = traffic
        this.carToFollow = carToFollow
        this.x = carToFollow.x
        this.y = carToFollow.y + 100
        this.width = 50
        this.height = 30
    }

    getTraffic = () => {
        return this.traffic
    }


    update() {
        this.y = this.carToFollow.y - 400
        if(this.y - this.traffic[5].y < -800){
            this.recycleTraffic()
        }
    }

    getTrafficDistance(){
        return this.traffic[5].y 
    }

    recycleTraffic() {
        let space = 100
        for(let i = 0; i < this.traffic.length; i++){
            this.traffic[i].y = this.y - space
            space = space + 100
        }
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