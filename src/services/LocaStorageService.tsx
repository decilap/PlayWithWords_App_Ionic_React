import { Preferences } from '@capacitor/preferences';

export const getItemFromLocalStorage = async (item:string):Promise<any>=> {
    let data:any = await Preferences.get({key: item});
    return JSON.parse(data.value);
}

export const setItemIntoLocalStorage = (key: string, objetStat:any) => {
    Preferences.set({key: key, value: JSON.stringify(objetStat)});
}

export const  updateStorage = async (key:string, dataStorage:any) => {
    let obj = await getItemFromLocalStorage(key);
    setItemIntoLocalStorage(
        key,
        Object.assign(obj, dataStorage)
    );
}

export const clearStorage = (key:string): Promise<void> => {
    return Preferences.remove({key:key});
}
