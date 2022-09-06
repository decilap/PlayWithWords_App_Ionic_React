import React from 'react';
export const countLettersInArray = (arr:Array<any>, val:number) => arr.reduce((a:number, v:number) => (v === val ? a + 1 : a),0);
export const countLetter = (str:any, find:any):any  => (str.split(find)).length - 1;
export const getClassNames = (args:any) => {
    let objEntries = Object.entries(args);
    if(objEntries.length > 0){
        let classes ='';
        for (const [key, value] of objEntries) {
            if(value){
                classes+=key + " ";
            }else{
              // classes='default';
            }
        }
        return classes.trim();
    }
};

