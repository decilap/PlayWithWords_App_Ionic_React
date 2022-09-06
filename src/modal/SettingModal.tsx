import {useRef} from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";

export const SettingModal = ({
                          onDismiss,
                      }: {
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
    const inputRef = useRef<HTMLIonInputElement>(null);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="medium" onClick={() => onDismiss(null, 'cancel')}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Welcome</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDismiss(inputRef.current?.value, 'confirm')}>Confirm</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="stacked">Enter your name</IonLabel>
                    <IonInput ref={inputRef} placeholder="Your name" />
                </IonItem>
            </IonContent>
        </IonPage>
    );
};
