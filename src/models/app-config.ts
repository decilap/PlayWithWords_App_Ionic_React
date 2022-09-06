
export class AppConfig{
  music: boolean = true;
  padSound: boolean = true;
  colNumber: number = 0;
  rowNumber: number = 0;
  numbersArray: {}
  keyboardState: number = 0;
  numberOfTries!: number;

  constructor(configs:any){
    Object.assign(this, configs)
  }
}


export default function updateSetting(datas, index, property, func){
  const results = datas.map((data:any, dataIndex:number) => {
    data[property] = dataIndex === index;
    return data;
  }); func();
  return results;
}

