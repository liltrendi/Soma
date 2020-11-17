import * as vscode from 'vscode';
import { webviewOnDidRecieveMessage } from './callbacks';
import { Scripts } from './interfaces';
import { getHtmlDocument } from './util';

export class SomaPanel {
    
    public static readonly viewType: string = "Soma";
    public static readonly panelTitle: string = "Soma";
    public static currentPanel: SomaPanel | undefined;

    private readonly _localResourcesPath: string = "injectibles";
    private readonly _webviewPanel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri){
        this._webviewPanel = panel;
        this._extensionUri = extensionUri;

        this._loadWebviewHtml()

        this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

        this._webviewPanel.webview.onDidReceiveMessage(webviewOnDidRecieveMessage, null, this._disposables);
    }

    public static createOrReveal(extensionUri: vscode.Uri) {

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

        SomaPanel.currentPanel = new SomaPanel(panel, extensionUri)
    }

    public getHtml(webview: vscode.Webview){

        const mainScriptPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "main.js");
        const mainScriptUri = webview.asWebviewUri(mainScriptPath);

        const mainStylesPath = vscode.Uri.joinPath(this._extensionUri, this._localResourcesPath, "main.css");
        const mainStylesUri = webview.asWebviewUri(mainStylesPath);

        const scripts: Scripts = {
            webview,
            mainScriptUri,
            mainStylesUri
        }

        return getHtmlDocument(scripts)

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