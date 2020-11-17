import * as vscode from 'vscode';

export interface Scripts {
    webview: vscode.Webview;
    mainScriptUri: vscode.Uri;
    mainStylesUri: vscode.Uri;
}

export interface MessageWebviewOnDidReceiveMessage {
    command: string;
    text: string;
}