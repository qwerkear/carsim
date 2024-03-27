class CarPopulationController {
    constructor(population, carToFollow){
        this.population = population

        this.carToFollow = carToFollow
        this.x = carToFollow.x
        this.y = carToFollow.y
        this.width = 50
        this.height = 30
    }

    setCarToFollow(c){
        this.carToFollow = c
    }

    update() {
        for(let i = 0; i < this.population.length; i++){
            if(this.population[i].damaged && this.population[i] != this.carToFollow){
                this.population.splice(i, 1)
            }
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
