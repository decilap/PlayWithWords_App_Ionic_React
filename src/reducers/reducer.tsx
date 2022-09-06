export const initialState = {
    loader: false
};

const reducer = (state:any, action:any) => {
    switch (action.type) {
        case "setLoader": {
            return { ...state, loader: action.loader };
        }
    }
    return state;
};

export default reducer;
