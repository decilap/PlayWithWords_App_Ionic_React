
export class AppConfig{
  music: boolean = true;
  padSound: boolean = true;
  colNumber: number = 0;
  rowNumber: number = 0;
  numbersArray: any;
  keyboardState: number = 0;
  numberOfTries!: number;

  constructor(configs:any){
    Object.assign(this, configs)
  }
}


export default function updateSetting(datas:any, index:number, property:string, func:any){
  const results = datas.map((data:any, dataIndex:number) => {
    data[property] = dataIndex === index;
    return data;
  }); func();
  return results;
}

