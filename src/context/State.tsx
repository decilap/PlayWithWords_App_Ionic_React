import React, {createContext, useEffect, useReducer} from "react";
import reducer, {initialState} from "../reducers/reducer";
import Config from "../model/Config";
import {Stat} from "../models/stat";
import Game from "../pages/Game";
import {AppConfig} from "../models/app-config";

localStorage.setItem("app", JSON.stringify(new Config({})));

const persistedState = localStorage.getItem("app")
    ? JSON.parse(window.localStorage["app"])
    : new Config({});



const pads = {
    layouts: [
        {
            layoutTop: ['A','Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            layoutCenter: ['Q','S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
            layoutBottom: ['W', 'X', 'C', 'V', 'B', 'N']
        },
        {
            layoutTop: ['B','E', 'P', 'O', 'W', 'V', 'D', 'L', 'J', 'Z'],
            layoutCenter: ['A', 'U', 'I', 'C', 'T', 'S', 'R', 'N', 'M', 'F'],
            layoutBottom: ['Y', 'X', 'K', 'Q', 'G', 'H']
        },
        {
            layoutTop: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            layoutCenter: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z'],
            layoutBottom: [ 'X', 'C', 'V', 'B', 'N', 'M']
        }
    ]
}

const appState = {
    rows: [],
    rowCount: 5,
    colCount: 5,
    letter: '',
    currentLayout: 0,
    currentCol: 0,
    currentRow: 0,
    finishedGame: false,
    isIndice: false,
    config: new AppConfig({}),
    stat: new Stat({}),
    game: new Game({}),
    classes: {
        default: 'default',
        success: 'success',
        warning: 'warning',
        dark: 'dark'
    }
}

let AppContext = createContext(initialState as any);


const AppContextProvider =  (props: any) => {
    const fullInitialState = {
        ...initialState,
        ...persistedState,
        ...pads,
        ...appState
    };

    let [state, dispatch] = useReducer(reducer, fullInitialState);
    let value = {state, dispatch};

    useEffect(() => {
        window.localStorage["app"] = JSON.stringify({
            loader: state.loader
        });
    }, [state]);

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}


let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
