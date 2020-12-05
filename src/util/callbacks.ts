import * as vscode from 'vscode';
import { MessageWebviewOnDidReceiveMessage, OpenedPdfFile } from '../annotations/interfaces';
import { SomaPanel } from '../controllers/panels';

const dialogOptions: vscode.OpenDialogOptions = {
    filters: { "pdf": ["pdf"] },
    title: "Soma - View PDF",
    canSelectFolders: false,
    canSelectMany: true,
};

export const someshaCallback = (context: vscode.ExtensionContext): void => {
    vscode.window.showOpenDialog(dialogOptions).then((result: Array<OpenedPdfFile> | undefined) => {
        
        if(result){
            for(let file of result){
                SomaPanel.createOrReveal(context, file);
            }
            return;
        }

        vscode.window.showErrorMessage("Please select a pdf file", "Cancel", "Open File Dialog")
            .then(selection => {
                if(selection === "Open File Dialog"){
                    someshaCallback(context);
                    return;
                }
            });
        
    });
};

export const webviewOnDidRecieveMessage = (message: MessageWebviewOnDidReceiveMessage) => {
    switch (message.command) {
        case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
    }
};