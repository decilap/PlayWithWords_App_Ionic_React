import {
    IonButton,
    IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import './Screen.css';
import React, { useContext, useEffect } from "react";
import {AppContext} from "../context/State";
import {countLetter, countLettersInArray, getClassNames} from "../utils/Utils";

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
                                    active:currentCol == indexCol + 1 && currentRow == indexRow
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
                currentCol: currentCol
            }});
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
                <Button className="center" finishedGame={finishedGame} alphabets={layouts[currentLayout].layoutBottom}/>
                <div className="keyboard__row">
                    <IonButton onClick={(e) => letterDeleted(e)} className="key--double key--letter" disabled={finishedGame} color="primary">Delete</IonButton>
                </div>
            </div>
        </div> : null
    )
}

const Home: React.FC = () => {
    const {state, dispatch} = useContext(AppContext);
    let {rows, currentCol, rowCount, currentRow, colCount, classes, chosenWord} = state;

    useEffect(() => { build(); }, []);

    const build = () => {
        let rows = [];
        //dispatch({ type: "updateProperty", data:{ chosenWord: 'TOTO' }});
        for (let row = 0; row < state.rowCount; row++) {
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
        dispatch({type: "updateProperty", data: {rows: rows}});
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
    const wordSubmitted = (event: any) => {
        let answersMap = rows.map((row: any) => row.letter);

        //let words:any = await this.appService.getListWords(this.colCount);

        if (!(currentCol < currentCol)/* && (!this.game.winner && !this.loser))*/) {
            /* if (this.isIndice || words.includes(answersMap.join(''))){
                 this.isIndice ? this.isIndice = !this.isIndice : '';*/
            addClassSuccessLetter();
            addClassWarnningLetter();

            dispatch({
                type: "updateProperty", data: {
                    rows: rows
                }
            });

            /*  dispatch({ type: "updateProperty", data: {
                      row: ++currentRow }});*/
            if (chosenWord === answersMap.join('')) {

                // this.playSound(this.playlist[1], this.playingMusicActive);
                //this.openModal("Youpii vous avez gagné 😀 ");
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
                    dispatch({
                        type: "updateProperty", data: {
                            currentRow: ++currentRow,
                            currentCol: 0
                        }
                    });
                    //  this.currentRow = ++this.currentRow;
                    //  this.currentCol = 0;
                    //  this.score++;
                    //  this.game.numberOfTries = this.score;
                } else {
                    //  this.playSound(this.playlist[0], this.playingMusicActive);
                    //  //this.appService.disabledButton(true);
                    //  this.loser = true;
                    //  this.openModal("Game Over 😥 ");
                    //  this.score++;
                    //  this.game.numberOfTries = this.score;
                    //  this.localStorageObject.stats.push(this.game);
                }
            }

        } else {
            //  return await this.loadToast("Le mot n'existe pas !", "top", "primary");
        }
        /*  }else{
              //return await this.loadToast("Le mot doit contenir " + this.colCount + " lettres !", "top", "primary");
          }*/
        // this.localStorage.setItemIntoLocalStorage(environment.statKey, this.localStorageObject);


    }

    return (
            <IonPage>
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
                    <Letter {...state}/>
                    <Buttons {...state} loadLetters={loadLetters} onSubmit={wordSubmitted}/>
                </IonContent>
            </IonPage>
    );
}

export default Home;
