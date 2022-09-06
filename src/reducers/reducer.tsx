import {updateStorage} from "../services/LocaStorageService";

export const initialState = {
    loader: false
};

const reducer = (state:any, action:any) => {
    switch (action.type) {
        case "updateStorage": {
            return { ...state, loader: action.loader };
        }
        case "updateProperty": {
            return { ...state, ...action.data };
        }
        case "addLetters": {
            return { ...state, letter: action.letter };
        }
    }
    return state;
};

export default reducer;
