class Car {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.velocity = 0
        this.acceleration = 0.2
        this.maxVelocity = 5
        this.friction = 0.05
        this.angle = 0

        this.sensor = new Sensor(this)

        this.controls = new Controls()
    }

    update(roadBorders) {
        this.#move()
        this.sensor.update(roadBorders)
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

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)

        ctx.beginPath()
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        )
        ctx.fill()

        ctx.restore()

        this.sensor.draw(ctx)
    }
}