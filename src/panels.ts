import * as vscode from 'vscode';
import * as path from 'path';
import { webviewOnDidRecieveMessage } from './callbacks';
import { HtmlUris } from './interfaces';
import { getHtmlDocument } from './util';
const fs = require('fs');

export class SomaPanel {
    
    public static readonly viewType: string = "Soma";
    public static readonly panelTitle: string = "Soma";
    public static currentPanel: SomaPanel | undefined;
    public panelContext: vscode.ExtensionContext;

    private readonly _localResourcesPath: string = "injectibles";
    private readonly _webviewPanel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _localFiles: vscode.Uri[] | undefined;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, files: vscode.Uri[] | undefined){
        this._webviewPanel = panel;
        this.panelContext = context;
        this._extensionUri = context.extensionUri;
        this._localFiles = files;

        this._loadWebviewHtml();

        this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

        this._webviewPanel.webview.onDidReceiveMessage(webviewOnDidRecieveMessage, null, this._disposables);
    }

    public static createOrReveal(context: vscode.ExtensionContext, files: vscode.Uri[] | undefined) {

        const column: vscode.ViewColumn | undefined = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        if(SomaPanel.currentPanel){
            SomaPanel.currentPanel._webviewPanel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            SomaPanel.viewType,
            SomaPanel.panelTitle,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "injectibles")]
            }
        );

        SomaPanel.currentPanel = new SomaPanel(panel, context, files);
    }

    public getPreparedHtml(webview: vscode.Webview){

        const mainScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "main.js");
        const mainScriptUri = webview.asWebviewUri(mainScriptPath);

        const pdfJsScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "pdf.js");
        const pdfJsScriptUri = webview.asWebviewUri(pdfJsScriptPath);

        const pdfJsWorkerScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "pdf.worker.js");
        const pdfJsWorkerScriptUri = webview.asWebviewUri(pdfJsWorkerScriptPath);

        const viewerScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "viewer.js");
        const viewerScriptUri = webview.asWebviewUri(viewerScriptPath);

        const mainStylesPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "main.css");
        const mainStylesUri = webview.asWebviewUri(mainStylesPath);

        const bootstrapStylesPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "bootstrap.min.css");
        const bootstrapStylesUri = webview.asWebviewUri(bootstrapStylesPath);

        const pdfFilePath = this._localFiles ? this._localFiles[0].path : "";
        const pdfAsBase64: string = fs.readFileSync(vscode.Uri.file(path.join(pdfFilePath)).path, {encoding: 'base64'});

        const uris: HtmlUris = {
            webview,
            mainScriptUri,
            mainStylesUri,
            pdfJsScriptUri,
            pdfJsWorkerScriptUri,
            viewerScriptUri,
            bootstrapStylesUri
        };

        return getHtmlDocument(webview, uris, pdfAsBase64);

    }

    private _loadWebviewHtml(){
        const webview = this._webviewPanel.webview;
        this._webviewPanel.webview.html = this.getPreparedHtml(webview);
    }

    public dispose() {
		SomaPanel.currentPanel = undefined;

		this._webviewPanel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}
}