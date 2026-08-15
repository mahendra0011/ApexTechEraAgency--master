import Canvas2d from "../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/presets/canvas2d"

class Animation extends Canvas2d {
    particles = []
    colors = ['#7398FF', '#F4CE72', '#BD99CA']
    startTime = performance.now()
    // delay = window.innerWidth < 600 ? 500 : 100
    count = window.innerWidth < 600 ? 8 : 30
    isActive = false


    constructor(parent, canvas, isActive) {
        super(parent, canvas)

        this.isActive = isActive
        this.setActive = this.setActive.bind(this)
        this.canvas.addEventListener('isActive', this.setActive)
        this.generate()

        this.toRender((time) => {
            if ( this.isActive ) {
                this.draw()
                // this.clear()
            }
            // } else {
            //     // this.clear()
            //     this.draw()
            // }
        })

        this.toResize(() => {
            this.draw()
            // this.clear()
        })
    }
    setActive(e) {
        this.isActive = e.detail
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height)
        this.particles.forEach(_ => {
            this.context.beginPath()
            this.context.arc(_.x, _.y, _.r, 0, Math.PI*2)
            this.context.fillStyle = _.color
            this.context.fill()
            this.context.closePath()
            _.y -= _.velocity

            if (_.y + _.r < 0) {
                _.y = this.height+100
            }
        })
    }
    generate(time) {
        // if ( time - this.startTime > this.delay ) {
            for (let i = 0; i < this.count; i++) {
                this.particles.push({
                    x: this.rMinMax(0, this.width),
                    y: this.rMinMax(this.height + 100, this.height + this.height),
                    r: this.rMinMax(3, 6),
                    color: this.rColor(),
                    velocity: this.rMinMax(3, 8)
                })
            }
            console.log(this.count, this.particles)
            // this.startTime = performance.now()
        // }
    }
    // clear() {
    //     // this.particles = this.particles.filter(_ => _.y + _.r >= 0)
    // }

    rMinMax(min, max) {
        return Math.random() * ( max - min ) + min
    }

    rColor() {
        return this.colors[Math.round(this.rMinMax(0, this.colors.length - 1))]
    }

    unmount() {
        this.canvas.removeEventListener('isActive', this.setActive)
    }

}

export default Animation