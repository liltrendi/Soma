import * as vscode from 'vscode';
import { MessageWebviewOnDidReceiveMessage } from './interfaces';
import { SomaPanel } from './panels';

export const someshaCallback = (context: vscode.ExtensionContext): void => {
    vscode.window.showInformationMessage("Click the '+' sign to add a pdf");
    SomaPanel.createOrReveal(context.extensionUri)
}

export const webviewOnDidRecieveMessage = (message: MessageWebviewOnDidReceiveMessage) => {
    switch (message.command) {
        case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
    }
}