import * as vscode from 'vscode';
import { webviewOnDidRecieveMessage } from './callbacks';
import { HtmlUris } from './interfaces';
import { getHtmlDocument } from './util';

export class SomaPanel {
    
    public static readonly viewType: string = "Soma";
    public static readonly panelTitle: string = "Soma";
    public static currentPanel: SomaPanel | undefined;

    private readonly _localResourcesPath: string = "injectibles";
    private readonly _webviewPanel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _localFiles: vscode.Uri[] | undefined
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, files: vscode.Uri[] | undefined){
        this._webviewPanel = panel;
        this._extensionUri = extensionUri;
        this._localFiles = files;

        this._loadWebviewHtml()

        this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

        this._webviewPanel.webview.onDidReceiveMessage(webviewOnDidRecieveMessage, null, this._disposables);
    }

    public static createOrReveal(extensionUri: vscode.Uri, files: vscode.Uri[] | undefined) {

        const column: vscode.ViewColumn | undefined = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

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
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, "injectibles")]
            }
        )

        SomaPanel.currentPanel = new SomaPanel(panel, extensionUri, files)
    }

    public getHtml(webview: vscode.Webview){

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

        const pdfFilePath = this._localFiles ? this._localFiles[0].path : "";
        const pdfFileUri = webview.asWebviewUri(vscode.Uri.file(pdfFilePath));

        const uris: HtmlUris = {
            webview,
            mainScriptUri,
            mainStylesUri,
            pdfJsScriptUri,
            pdfJsWorkerScriptUri,
            viewerScriptUri,
            pdfFileUri
        }

        return getHtmlDocument(webview, uris)

    }

    private _loadWebviewHtml(){
        const webview = this._webviewPanel.webview;
        this._webviewPanel.webview.html = this.getHtml(webview)
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