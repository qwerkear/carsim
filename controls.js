class Controls {
    constructor(type) {
        this.forward = false
        this.left = false
        this.right = false
        this.reverse = false

        switch(type){
            case "KEYS":
                this.#addKeyboardListeners()
                break
            case "DUMMY":
                this.forward = true
                break
            }
    }

    //TO accept user input, we map the keyup and keydown values of the arrow keys
    //to the car's directional variables
    //TODO: refactor deprecated event structure
    #addKeyboardListeners() {
        document.onkeydown = () => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true
                    break
                case "ArrowRight":
                    this.right = true
                    break
                case "ArrowUp":
                    this.forward = true
                    break
                case "ArrowDown":
                    this.reverse = true
                    break
            }
            console.table(this)
        }
        document.onkeyup = () => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false
                    break
                case "ArrowRight":
                    this.right = false
                    break
                case "ArrowUp":
                    this.forward = false
                    break
                case "ArrowDown":
                    this.reverse = false
                    break
            }
            console.table(this)
        }
    }
}