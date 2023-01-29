import LBCard from "./londonbridge-card"

class LBPlayer{
    state: string
    hand: LBCard[]
    score: number
    runs: LBCard[][]
    sets: LBCard[][]
    constructor(){
        this.state = 'starting'
        this.hand = []
        this.score = 0
        this.runs = []
        this.sets = []
    }
}

export default LBPlayer;