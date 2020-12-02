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

export const getHtmlDocument = (webview: vscode.Webview, config: HtmlUris, pdfAsBase64: string): string => {
    
    let {mainScriptUri, mainStylesUri, pdfJsScriptUri, pdfJsWorkerScriptUri, viewerScriptUri} = config;
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
                <!--
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
                -->
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="pdfAsBase64" content="${pdfAsBase64}">
                <link href="${mainStylesUri}" rel="stylesheet">
                <title>Soma</title>
            </head>
            <body>

                <button id="showPdfBtn">Show PDF</button> 

                <div id="pdfMainContainer">
                    <div id="pdfLoader">Loading document ...</div>
                    <div id="pdfContents">
                        <div id="pdfMeta">
                            <div id="pdfBtns">
                                <button id="previousBtn">Previous</button>
                                <button id="nextBtn">Next</button>
                            </div>
                            <div id="pageCountDiv">Page <div id="pdfCurrentPage"></div>
                            <!-- of <div id="pdfTotalPages"> -->
                            </div></div>
                        </div>
                        <canvas id="pdfCanvas" width="400"></canvas>
                        <div id="loaderDiv">Loading page ...</div>
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