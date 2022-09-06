import {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import React, {useContext, useEffect, useState} from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {fetchData, getRandomWord} from "../services/app-service";
import {AppContext} from "../context/State";
import {getItemFromLocalStorage, setItemIntoLocalStorage} from "../services/LocaStorageService";
import {Stat} from "../models/stat";


const Home: React.FC<RouteComponentProps> = ({history}) => {
    const {state, dispatch} = useContext(AppContext);


    useEffect(() => {
        init();
    }, []);

    const start = (e:any) => {
        e.preventDefault();
        setItemIntoLocalStorage(('statKey'), state.stat);
        setItemIntoLocalStorage('configKey', state.config)
        history.push('/game');
    }

     const init = async () => {
         const appConfig = await getItemFromLocalStorage('configKey') || state.config;
         let chosenWord = await getRandomWord(state.colCount);

         dispatch({ type: "updateProperty", data:{ config: appConfig }});
         dispatch({ type: "updateProperty", data:{ stat: new Stat({
                     goalWord: chosenWord
                 })}});
     }
    return (
            <IonPage className="page">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Blank</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Blank</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <div className="container">
                        <div className="button" onClick={(e) => start(e)}>
                                <span>Start</span>
                        </div>
                        <div className="sun"></div>
                    </div>
                </IonContent>
            </IonPage>
    );
}

export default withRouter(Home);
