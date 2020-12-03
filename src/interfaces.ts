import * as vscode from 'vscode';

export interface HtmlUris {
    webview: vscode.Webview;
    mainScriptUri: vscode.Uri;
    mainStylesUri: vscode.Uri;
    pdfJsScriptUri: vscode.Uri;
    pdfJsWorkerScriptUri: vscode.Uri;
    viewerScriptUri: vscode.Uri;
    bootstrapStylesUri: vscode.Uri;
}

export interface MessageWebviewOnDidReceiveMessage {
    command: string;
    text: string;
}