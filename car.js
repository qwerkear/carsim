class Car {
    constructor(x, y, width, height, controlType, maxVelocity = 3) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.velocity = 0
        this.acceleration = 0.2
        this.maxVelocity = maxVelocity
        this.friction = 0.05
        this.angle = 0
        this.damaged = false

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this)
        }

        this.controls = new Controls(controlType)
    }

    update(roadBorders, traffic) {
        //if (!this.damaged) { //this line will stop motion if the car becomes damaged
        this.#move()
        this.polygon = this.#createPolygon()
        this.damaged = this.#assessDamage(roadBorders, traffic)
        //}
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic)
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true
            }
        }
        return false
    }

    #createPolygon() {
        const points = []
        const rad = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height)
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        })

        return points
    }

    #move() {

        //TO move forward we increment the velocity by acceleration
        if (this.controls.forward) {
            this.velocity += this.acceleration
        }
        //TO move backwards we increment the velocity by decrementing the velocity by the acceleration
        if (this.controls.reverse) {
            this.velocity -= this.acceleration
        }

        //TO prevent the car from rotating in place, we check if the velocity is 0
        //  if the car has positive velocity, control normally,
        //  if the car has negative velocity, flip the angle of rotation
        //  (this simulates a car always turning the same direction as the wheel is turned)
        //      TO turn the car increment the angle by .03 (see unit circle)
        if (this.velocity != 0) {
            const flip = this.velocity > 0 ? 1 : -1
            if (this.controls.left) {
                this.angle += 0.02 * flip
            }
            if (this.controls.right) {
                this.angle -= 0.02 * flip
            }
        }

        //TO limit forward velocity, we set the velocity to the maximum if it is higher
        if (this.velocity > this.maxVelocity) {
            this.velocity = this.maxVelocity
        }
        //TO limit backward velocity, we set the velocity to the maximum if it is higher
        //  To limit backward velocity by half of forward velocity, we divide maxVelocity in half
        if (this.velocity < -this.maxVelocity / 2) {
            this.velocity = - this.maxVelocity / 2
        }

        //TO add natural deceleration, we decrement/increment velocity opposite to the direction
        //  by the friction value
        if (this.velocity > 0) {
            this.velocity -= this.friction
        }
        if (this.velocity < 0) {
            this.velocity += this.friction
        }
        //TO prevent the car from moving between the friction values,
        //we set the velocity to 0 when below the friction value
        if (Math.abs(this.velocity) < this.friction) {
            this.velocity = 0
        }

        //TO change the position of the car we adjust the x and y values to
        //sin/cos of the car's angle and multiply by the velocity
        this.x -= Math.sin(this.angle) * this.velocity
        this.y -= Math.cos(this.angle) * this.velocity
    }

    draw(ctx, color) {
        if (this.damaged) {
            ctx.fillStyle = "gray"
        } else {
            ctx.fillStyle = color
        }
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()

        if (this.sensor) {
            this.sensor.draw(ctx)
        }
    }
}