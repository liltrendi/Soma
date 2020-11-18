import * as vscode from 'vscode';
import { HtmlUris } from "../interfaces";

export const getNonce = (): string => {
	let text = '';
	const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
	}
	return text;
}

export const getHtmlDocument = (webview: vscode.Webview, config: HtmlUris): string => {
    
    let {mainScriptUri, mainStylesUri, pdfJsScriptUri, pdfJsWorkerScriptUri, viewerScriptUri, pdfFileUri} = config;
    let nonce: string = getNonce()

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!--
                    Use a content security policy to only allow loading images from https or from our extension directory,
                    and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="extensionPdfUri" content="${pdfFileUri}">
                <link href="${mainStylesUri}" rel="stylesheet">
                <title>Soma</title>
            </head>
            <body>

                <button id="show-pdf-button">Show PDF</button> 

                <div id="pdf-main-container">
                    <div id="pdf-loader">Loading document ...</div>
                    <div id="pdf-contents">
                        <div id="pdf-meta">
                            <div id="pdf-buttons">
                                <button id="pdf-prev">Previous</button>
                                <button id="pdf-next">Next</button>
                            </div>
                            <div id="page-count-container">Page <div id="pdf-current-page"></div> of <div id="pdf-total-pages"></div></div>
                        </div>
                        <canvas id="pdf-canvas" width="400"></canvas>
                        <div id="page-loader">Loading page ...</div>
                    </div>
                </div>

                <script nonce="${nonce}" src="${pdfJsScriptUri}"></script>
                <script nonce="${nonce}" src="${pdfJsWorkerScriptUri}"></script>
                <script nonce="${nonce}" src="${viewerScriptUri}"></script>
                <script nonce="${nonce}" src="${mainScriptUri}"></script>
            </body>
        </html>
    `;
    
}