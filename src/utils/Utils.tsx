export default class Config{
    colCount:number=0;
    rowCount:number=0;

    constructor(config:any) {
        Object.assign(this, config);
    }
}
