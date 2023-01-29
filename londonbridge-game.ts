import LBPlayer from "./londonbridge-player"
import LBCard from "./londonbridge-card"

class LBGame{
  data:{
    round: number
    phase: string
    turnPlayer: number
    deck: LBCard[]
    discard: LBCard[]
    players: LBPlayer[]
  }
    
  constructor(data: { round: number; phase: string; turnPlayer: number; deck: LBCard[]; discard: LBCard[]; players: LBPlayer[] }){
    this.data = data
  }

  addPlayer(): number {
    this.data.players.push(new LBPlayer())
    return this.data.players.length
  }

  isReadyToStart(): boolean{
    return (this.data.players.length==4)
  }

  setupGame() {
    this.shuffleDeck()
    this.data.round+=1
    this.setupPlayers()
    this.data.discard.push(this.data.deck.pop()!)
    this.data.phase = "drawing"
    this.data.players[this.data.turnPlayer].state = 'pickup'
  }

  setupPlayers(){
    for (var player of this.data.players){
      player.hand = this.data.deck.splice(0,11)
      player.state = 'buying'
    }
  }

  shuffleDeck() {
    this.data.deck = []
    for (var suit of ['spades','hearts','clubs','diamonds']){
      var number = 0
      for (var points of [50, 20, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 15]){
        number++
        if (points == 50){
          this.data.deck.push(new LBCard(number, suit, points))
        }
        else{
          this.data.deck.push(new LBCard(number, suit, points), new LBCard(number, suit, points))
        }
      }
    }
  }

  resolveAction(){
    if (this.data.phase == "drawing"){
      if (this.data.players.every((LBPlayer) =>{return (LBPlayer.state == "waiting" || LBPlayer.state == "want")})){
        var pickedUp  = false
        for (let i = 0; i<4; i++){
          if (this.data.players[(this.data.turnPlayer+i)%4].state == "want"){
            this.resolveWant(i)
            pickedUp = true
            break
          }
        }
        if (!pickedUp) {
          this.data.players[this.data.turnPlayer].hand.push(this.data.deck.pop()!)
        }
        this.data.phase = "discarding"
        this.data.players[this.data.turnPlayer].state = "discarding"
      }
    }
    else if (this.data.phase == "discarding"){
      this.data.turnPlayer = (this.data.turnPlayer+1)%4
      this.data.players[this.data.turnPlayer].state = "pickup"
      this.data.players[(this.data.turnPlayer+1)%4].state = "buying"
      this.data.players[(this.data.turnPlayer+2)%4].state = "buying"
      this.data.players[(this.data.turnPlayer+3)%4].state = "waiting"
      this.data.phase = "drawing"
    }
    else if (this.data.phase == "ending"){
      this.endRound()
    }
  }

  resolveWant(offset:number){
    if (offset == 0){
      this.data.players[this.data.turnPlayer].hand.push(this.data.discard.pop()!)
    }
    else {
      this.data.players[(this.data.turnPlayer+offset)%4].hand.push(this.data.deck.pop()!, this.data.discard.pop()!)
      this.data.players[this.data.turnPlayer].hand.push(this.data.deck.pop()!)
    }
  }

  endRound(){
    this.data.players.forEach((player) => {
      player.hand.forEach((card) =>{
        player.score += card.points
      })
      player.hand = []
      player.runs = []
      player.sets = []
    })
    this.data.turnPlayer = this.data.round%4
    this.data.discard = []
    this.setupGame()
  }
}

export default LBGame;