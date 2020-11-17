import * as vscode from 'vscode';

export const sayHelloCallback = () => {
    console.log("Invoking")
    vscode.window.showInformationMessage('Mambo vipi!');
}