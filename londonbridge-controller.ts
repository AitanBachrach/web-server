import Level from "level-ts";
import LBGame from "./londonbridge-game";
import LBPlayer from "./londonbridge-player";

var gamesDB = new Level<LBGame>('./london-bridge')



export async function makeGame(id: string): Promise<LBGame>{
  console.log(id)
  if (!await gamesDB.exists(id)){
    var game = new LBGame({round:0, phase:'starting', turnPlayer:0, deck:[], discard:[], players:[]})
    game.addPlayer()
    console.log('made game')
    return await gamesDB.put(id, game)
  }
  else{
    throw console.error('already exists');
  }
};

export async function addPlayer(id:string): Promise<LBGame>{
  if (await gamesDB.exists(id)){
    var game = await gamesDB.get(id)
    if (game.data.players.length < 4){
      game = new LBGame(game.data)
      game.addPlayer()
      if (game.isReadyToStart()){
        game.setupGame()
      }
      return await gamesDB.put(id, game)
    }
    else{
      throw console.error('already full')
    }
  }
  else{
    throw console.error('not found');
  }
}

export async function getGame(id:string): Promise<LBGame>{
  if (await gamesDB.exists(id)){
    return await gamesDB.get(id)
  }
  else{
    throw console.error('not found');
  }
}

export async function putGame(id:string, newGame:LBGame): Promise<LBGame>{
  if (await gamesDB.exists(id)){
    var game = new LBGame(newGame.data)
    game.resolveAction()
    return await gamesDB.put(id, game)
  }
  else{
    throw console.error('not found');
  }
}

//async function checkForGame(id){

//}



