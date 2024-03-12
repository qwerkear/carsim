class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x
        this.width = width

        this.laneCount = laneCount;

        this.left = x - width / 2
        this.right = x + width / 2

        //large numbers for setting road length, using Infinity gets messy
        const LARGE_NUMBER = 99999999
        this.top = -LARGE_NUMBER
        this.bottom = LARGE_NUMBER

        //borders
        const topLeft = { x: this.left, y: this.top }
        const topRight = { x: this.right, y: this.top }
        const bottomLeft = { x: this.left, y: this.bottom }
        const bottomRight = { x: this.right, y: this.bottom }
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    //TO position the car in the center of a lane, we provide the index of the lane we want,
    //  using the road width divided by the lane count, we can get the width of each lane
    //  we find the lane by starting at the left of the road (this.left), 
    //  adding by the midpoint (laneWidth/2) multiplied
    //  by the laneIndex times the width of each lane
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount
        return this.left + laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth
        //line 19 picks the smaller between the laneIndex provided and the lane count (-1 for indexing) 
        //This references the outter most lane in case laneIndex is out of bounds
    }

    draw(ctx) {
        //Set the lines for a road
        ctx.lineWidth = 5
        ctx.strokeStyle = "white"

        //TO draw lanes with dashed lines, we use linear extrapolation to evenly divide the road
        //  and draw the lines for each lane (there will be one less line for every lane)
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            )

            ctx.setLineDash([20, 20])


            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }

        //setLineDash defines how the lines on the road are drawn, empty array for solid
        ctx.setLineDash([])

        //TO set borders for the road, we take the borders and draw along them
        this.borders.forEach(border => {
            ctx.beginPath()
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.stroke()
        })

    }
}

