import {
    IonButton,
    IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar, useIonModal, useIonToast
} from '@ionic/react';
import './Game.css';
import './Screen.css';
import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/State";
import {countLetter, countLettersInArray, getClassNames} from "../utils/Utils";
import {RouteComponentProps, withRouter} from "react-router";
import Swal from 'sweetalert2';
import {decrypt, getListWords, getRandomWord} from "../services/app-service";
import {getItemFromLocalStorage, updateStorage} from "../services/LocaStorageService";
import {Game} from "../models/stat";
import {SettingModal} from "../modal/SettingModal";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";

const Button =  (props:any) => {
    const { state, dispatch } = useContext(AppContext);
    const addLetter = (event:any) => {
        props.loadLetters(event.target.textContent);
    };
    return (
        <div className="keyboard__row">
            { props.alphabets.map((alphabet:any, index:number) =>
                (<IonButton key={index} className="key--letter"
                            onClick={(e) => addLetter(e)}
                            disabled={props.finishedGame}>
                    <span>{alphabet}</span>
                </IonButton>
            ))}
        </div>
    )
}

const Letter =  (props:any) => {
    const { rows, currentCol, currentRow} = props;
    return (
        <IonGrid className="screens" >
            { rows.map((row:any, indexRow:number) => (
                <IonRow key={indexRow} className="justify-content-center">
                    { row.map((col:any, indexCol:number) => (
                        <IonCol key={indexCol} className="screen">
                            <section className="stage" id={col.class}>
                                <figure className={`ball ${col.class +' '+ getClassNames({
                                    active:currentCol == indexCol && currentRow == indexRow
                                    })}`}>
                                    <span className="shadow"/>
                                    <div className={`${col.active == true ? 'text ' : ''}`}>
                                        {col.active == true ? col.letter : ""}
                                    </div>
                                </figure>
                            </section>
                        </IonCol> ))}
                </IonRow>
            ))}
        </IonGrid>
    )
}

const Buttons =  (props:any) => {
    const { dispatch } = useContext(AppContext);
    let { rows, currentCol, currentRow, layouts, currentLayout, finishedGame,classes} = props;
    const letterDeleted = (event: any) => {
        if (currentCol > 0){
            // this.playSound(this.playlist[3], this.playingPadActive);
            --currentCol
            rows[currentRow][currentCol] = {
                letter: '',
                active: false,
                class: classes.default,
                status: 'default'
            };
            dispatch({ type: "updateProperty", data: {
                       rows: rows,
                       currentCol: currentCol }});
        }
    }
    return (
        layouts.length > 0 ? <div className="keyboard">
            <div>
                <Button loadLetters={props.loadLetters}  finishedGame={finishedGame} alphabets={layouts[currentLayout].layoutTop}/>
                <Button loadLetters={props.loadLetters} finishedGame={finishedGame} alphabets={layouts[currentLayout].layoutCenter}/>
            </div>
            <div className="bottom">
                <div className="keyboard__row">
                    <IonButton onClick={(e) => props.onSubmit(e)} className="key--double key--letter" disabled={finishedGame} color="primary">Enter</IonButton>
                </div>
                <Button className="center" loadLetters={props.loadLetters} finishedGame={finishedGame} alphabets={layouts[currentLayout].layoutBottom}/>
                <div className="keyboard__row">
                    <IonButton onClick={(e) => letterDeleted(e)} className="key--double key--letter" disabled={finishedGame} color="primary">Delete</IonButton>
                </div>
            </div>
        </div> : null
    )
}


const Modal = (props:any) => {

    useEffect(() => {
        console.log('ok')
    }, []);


    const [present, dismiss] = useIonModal(SettingModal, {
        onDismiss: (data: string, role: string) => dismiss(data, role),
    });
    const [message, setMessage] = useState('This modal example uses the modalController to present and dismiss modals.');

    const openModal = () => {
        present({
            onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
                if (ev.detail.role === 'confirm') {
                    setMessage(`Hello, ${ev.detail.data}!`);
                }
            },
        });
    }

    return (
        <>
            <IonButton expand="block" onClick={() => openModal()}>
                Open {message}
            </IonButton>
        </>
    );

}


const Home: React.FC<RouteComponentProps> = ({history}) => {
    const {state, dispatch} = useContext(AppContext);
    const [chosenWord, setChosenWord] = useState('');

    let {rows, currentCol, rowCount, currentRow, colCount, classes, isIndice, config} = state;

    const [present] = useIonToast();

    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        const configStorage = await getItemFromLocalStorage('configKey');

        const playingPadActive = configStorage.padSound;
        const playingMusicActive = configStorage.music;
        const rowCount = configStorage.rowNumber === 0 ? 5 : 2;
        const colCount = configStorage.colNumber === 0 ? 5 : configStorage.colNumber === 1 ? 6 :
            configStorage.colNumber === 2 ? 7 : 8;

        dispatch({type: "updateProperty", data: {
                rowCount: rowCount,
                colCount: colCount
            }});


        build();

        //setStat(new Stat({}))
       // this.playSound(this.playlist[1], this.playingMusicActive);

    }
    const build = async () => {
        let rows = [];
        let chosenWord = decrypt(
            (await getItemFromLocalStorage('statKey')).goalWord,
            "denis");
        console.log("store ", chosenWord)
        setChosenWord(chosenWord);
        for (let row = 0; row < rowCount; row++) {
            let cols = [];
            for (let col = 0; col < state.colCount; col++) {
                cols.push({
                    letter: '',
                    active: false,
                    class: classes.default,
                    status: ''
                });
            }
            rows.push(cols);
        }

        dispatch({type: "updateProperty", data: {rows: rows, chosenWord: chosenWord}});
    }
    const findCorrectStatus = (tabLetters: any, letter: string) => {
        return rows.filter((col: any) => col.status === 'correct' && col.letter === letter);
    }
    const loadLetters = (letter: string) => {

        if (currentCol < colCount) {
            //state.playSound(state.playlist[2], state.playingPadActive);

            rows[currentRow][currentCol].letter = letter;
            if (currentRow < state.rowCount) {
                rows[currentRow][currentCol].active = true;
            } else {
                //return await state.loadToast("Game Over", "bottom", "primary");
            }

            dispatch({
                type: "updateProperty", data: {
                    rows: rows,
                    currentCol: ++currentCol
                }
            });

        }
    }
    const addClassSuccessLetter = () => {
        let answers = [];
        for (let i = 0; i < rows[currentRow].length; i++) {
            let letter = rows[currentRow][i].letter;
            let col = rows[currentRow][i];
            answers.push(letter);
            if (chosenWord.includes(letter)) {
                if (chosenWord[i] === letter) {
                    col.class = classes.success;
                    col.status = 'correct';
                    //this.game.correctLetter.push(col.letter);
                } else {
                    if (countLettersInArray(answers, letter) <= countLetter(chosenWord, letter)) {
                        col.status = 'misplaced';
                    } else {
                        col.status = 'noExist';
                        col.class = "dark";
                    }
                }
            } else {
                col.class = "dark";
                col.status = 'noExist';
            }
        }
    }
    const addClassWarnningLetter = () => {
        for (let i = 0; i < rows[currentRow].length; i++) {
            let col = rows[currentRow][i]
            let letter = rows[currentRow][i].letter;
            if (chosenWord.includes(letter)) {
                let correctStatus: number = findCorrectStatus(rows, letter).length;
                let countLetterInChosenWord: number = countLetter(chosenWord, letter);
                if (chosenWord[i] !== letter) {
                    if (correctStatus < countLetterInChosenWord && col.status !== 'noExist') {
                        col.class = classes.warning;
                        //game.incorrectLetter.push(col.letter);
                    } else {
                        col.class = "dark";
                        col.status = 'noExist';
                    }
                }
            }
        }
    }
    const presentToastError = (message:string, position: any, color:string) => {
        present({
            message: message,
            duration: 1500,
            position: position,
            color: color
        });
    };
    const presentSwallInfo = (message:string, icon:any) => {
       return  Swal.fire({
            title: 'GAME <b>WINNER</b>',
            icon: icon,
            heightAuto: false,
            html: message,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Continue',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
                'Quitter',
            cancelButtonAriaLabel: 'Thumbs down'
        })
    }
    const updateChoice = async (message:string, icon:string) => {
        const {value} = await presentSwallInfo(message, icon);
        if (value) {
            let chosenWordEncrypt = await getRandomWord(colCount);
            dispatch({
                type: "updateProperty", data: {
                    currentCol: 0,
                    currentRow: 0,
                    game: new Game({})
                }
            });
            let chosenWord = decrypt(chosenWordEncrypt, 'denis');
            await updateStorage('statKey', {goalWord: chosenWordEncrypt});
            build();
        } else {
            history.goBack();
        }
    }
    const wordSubmitted = async (event: any) => {
        let answersMap = rows[currentRow].map((row: any) => row.letter);
        let words:any = await getListWords(state.colCount);

        if (!(currentCol < colCount)) {
            if (isIndice || words.includes(answersMap.join(''))) {
                isIndice = (() => !isIndice)();
                addClassSuccessLetter();
                addClassWarnningLetter();
                dispatch({ type: "updateProperty", data: { rows: rows }});

                if (chosenWord === answersMap.join('')) {
                    await updateChoice('Vous avez gagner', 'success');
                    // this.playSound(this.playlist[1], this.playingMusicActive);
                    // this.game.chosenWinner = this.chosenWord;
                    //this.appService.disabledButton(true);
                    // this.score++;
                    // this.game.numberOfTries = this.score;
                    // this.game.winner = true;
                    // this.localStorageObject.wonGame+=1;
                    // this.localStorageObject.stats.push(this.game);
                    //this.localStorageObject.goalWord = await this.appService.getRandomWord();
                } else {
                    if (currentRow < rowCount - 1) {
                        dispatch({  type: "updateProperty", data: {
                                    currentRow: ++currentRow,
                                    currentCol: 0 }});
                        //  this.currentRow = ++this.currentRow;
                        //  this.currentCol = 0;
                        //  this.score++;
                        //  this.game.numberOfTries = this.score;
                    } else {
                        //  this.playSound(this.playlist[0], this.playingMusicActive);
                        //  //this.appService.disabledButton(true);
                        //  this.loser = true;
                        await updateChoice('Vous avez perdu', 'error');
                        //  this.score++;
                        //  this.game.numberOfTries = this.score;
                        //  this.localStorageObject.stats.push(this.game);
                    }
                }
            } else {
                    presentToastError("Le mot n'existe pas !", "top", "danger");
            }
        } else {
            presentToastError("Le mot doit contenir " + colCount + " lettres !", "top", "danger");
        }
    }
    const randomNumshuffle = (a:Array<any>) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const indice = (event:any) => {
        console.log("store ", chosenWord)
        if(!isIndice){
            isIndice = true;
            let alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            let usedNums = chosenWord.split('');
            let usedNumsRandom = randomNumshuffle(usedNums).slice(-2);
            let alphabetLettersSliceCount = colCount === 5 ? -3 :
                colCount === 6 ? -4 :
                colCount === 6 ? -4 :
                colCount === 7 ? -5 : -6;
            let alphabetLettersRandom = randomNumshuffle(alphabetLetters).splice(alphabetLettersSliceCount);
            let mergeLetters = usedNumsRandom.concat(alphabetLettersRandom);
            let promesse = new Promise<void>((resolve, reject) => {
                randomNumshuffle(mergeLetters).forEach((letter:string, index:number) => {
                    //setTimeout(() => {
                        rows[currentRow][index] = {
                            letter: letter,
                            active: true,
                            class: classes.default,
                            status: ''
                        };
                        currentCol = index + 1;
                        if(index === mergeLetters.length - 1){  resolve(); }
                   // }, 100 * (index + 1));
                });
            });

            promesse.then(() => {
                wordSubmitted(null);
            });
        }
    }

    return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Le Mot</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <Letter {...state}/>
                    <Buttons {...state} loadLetters={loadLetters} onSubmit={wordSubmitted}/>
                    <p onClick={(e) => indice(e)}>tst</p>
                    <Modal/>
                </IonContent>
            </IonPage>
    );
}

export default withRouter(Home) ;
