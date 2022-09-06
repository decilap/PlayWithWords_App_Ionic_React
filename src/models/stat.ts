
export class Game{
  winner:boolean = false;
  numberOfTries: number = 0;
  incorrectLetter:Array<string> = [];
  correctLetter:Array<string> = [];
  chosenWinner:string;

  constructor(game:any){
    Object.assign(this, game)
  }
}

export class Stat{
  wonGame: number = 0;
  pseudo: string='';
  goalWord: string='';
  stats:Array<Game>=[];

  constructor(stat:any){
    Object.assign(this, stat)
  }
}
