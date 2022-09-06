
//const url = "./assets/json/letter"+colCount+".json";
import * as CryptoJS from "crypto-js";

export const fetchData = async (url:string) => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log("error", error);
    }
};

export const getRandomWord = (colCount:number): Promise<any> =>{
    let url = "./assets/json/letter"+colCount+".json";
    return fetchData(url).then((data:any) => {
            return encrypt(
                data.wordlist[Math.floor(Math.random() * data.wordlist.length)],
                'denis').toString()
        });
}

export const getListWords = (colCount:number): Promise<any> => {
    let url = "./assets/json/letter"+colCount+".json";
    return fetchData(url).then((data:any) => {
            return data.wordlist;
        });
}


export const encrypt = (message:string, key:string) => {
    return CryptoJS.AES.encrypt(message, key);
}


export const decrypt = (encrypted:string, key:string) => {
    return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
}
