import * as vscode from 'vscode';
import * as path from 'path';
import { webviewOnDidRecieveMessage } from '../util/callbacks';
import { HtmlUris } from '../annotations/interfaces';
import { getHtmlDocument } from '../util';
const fs = require('fs');

export class SomaPanel {
    
    public static readonly viewType: string = "Soma";
    public static readonly panelTitle: string = "Soma";
    public static currentPanel: SomaPanel | undefined;
    public panelContext: vscode.ExtensionContext;

    private readonly _localResourcesPath: string = "injectibles";
    private readonly _webviewPanel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _localFile: vscode.Uri | undefined;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, file: vscode.Uri | undefined){
        this._webviewPanel = panel;
        this.panelContext = context;
        this._extensionUri = context.extensionUri;
        this._localFile = file;

        this._loadWebviewHtml();

        this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

        this._webviewPanel.webview.onDidReceiveMessage(webviewOnDidRecieveMessage, null, this._disposables);
    }

    public static createOrReveal(context: vscode.ExtensionContext, file: vscode.Uri | undefined) {

        const column: vscode.ViewColumn | undefined = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // if(SomaPanel.currentPanel){
        //     SomaPanel.currentPanel._webviewPanel.reveal(column);
        //     return;
        // }

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

        SomaPanel.currentPanel = new SomaPanel(panel, context, file);
    }

    public getPreparedHtml(webview: vscode.Webview){

        const mainScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "js", "main.js");
        const mainScriptUri = webview.asWebviewUri(mainScriptPath);

        const pdfJsScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "lib", "pdfjs", "pdf.js");
        const pdfJsScriptUri = webview.asWebviewUri(pdfJsScriptPath);

        const pdfJsWorkerScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "lib", "pdfjs", "pdf.worker.js");
        const pdfJsWorkerScriptUri = webview.asWebviewUri(pdfJsWorkerScriptPath);

        const viewerScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "lib", "viewer", "viewer.js");
        const viewerScriptUri = webview.asWebviewUri(viewerScriptPath);

        const viewerStylesPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "lib", "viewer", "viewer.css");
        const viewerStylesUri = webview.asWebviewUri(viewerStylesPath);

        const mainStylesPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "css", "main.css");
        const mainStylesUri = webview.asWebviewUri(mainStylesPath);

        const bootstrapStylesPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "lib", "bootstrap", "bootstrap.min.css");
        const bootstrapStylesUri = webview.asWebviewUri(bootstrapStylesPath);

        const pdfFilePath = this._localFile ? this._localFile.path : "";
        const pdfAsBase64: string = fs.readFileSync(vscode.Uri.file(path.join(pdfFilePath)).path, {encoding: 'base64'});

        const uris: HtmlUris = {
            webview,
            mainScriptUri,
            mainStylesUri,
            pdfJsScriptUri,
            pdfJsWorkerScriptUri,
            viewerScriptUri,
            bootstrapStylesUri,
            viewerStylesUri
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