import * as vscode from 'vscode';
import { HtmlUris } from "../annotations/interfaces";

export const getNonce = (): string => {
	let text = '';
	const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
	}
	return text;
};

export const getHtmlDocument = (webview: vscode.Webview, config: HtmlUris, pdfAsBase64: string): string => {
    
    let {mainScriptUri, mainStylesUri, pdfJsScriptUri, pdfJsWorkerScriptUri, viewerScriptUri, bootstrapStylesUri, viewerStylesUri} = config;
    let nonce: string = getNonce();

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
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="pdfAsBase64" content="${pdfAsBase64}">
                <!-- <link href="${viewerStylesUri}" rel="stylesheet"> -->
                <link href="${bootstrapStylesUri}" rel="stylesheet">
                <link href="${mainStylesUri}" rel="stylesheet">
                <title>Soma</title>
            </head>
            <body>
                
                <div class="container-fluid">
                    <div class="row" id="pdfMainContainer">
                        <div class="col-12">
                            <div id="pdfLoader">Opening PDF, please wait...</div>
                            <div id="pdfContents">
                                <div id="pdfMeta">
                                    <div id="pdfBtns">
                                        <button class="btn btn-sm btn-primary mr-1" id="previousBtn">Prev</button>
                                        <button class="btn btn-sm btn-primary" id="nextBtn">Next</button>
                                    </div>
                                    <div id="pdfZoomBtns">
                                        <button class="btn btn-sm btn-primary mr-1" id="zoomInBtn">+</button>
                                        <p id="zoomPercent" class="text-warning">
                                        </p>
                                        <button class="btn btn-sm btn-primary ml-1" id="zoomOutBtn">-</button>
                                    </div>
                                    <div id="pageCountDiv" class="text-primary text-small">
                                        Page <div id="pdfCurrentPage"></div>
                                        <div id="pdfTotalPages">
                                    </div></div>
                                </div>
                                <canvas id="pdfCanvas"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <script nonce="${nonce}" src="${pdfJsScriptUri}"></script>
                <script nonce="${nonce}" src="${pdfJsWorkerScriptUri}"></script>
                <script nonce="${nonce}" src="${viewerScriptUri}"></script>
                <script nonce="${nonce}" src="${mainScriptUri}"></script>
            </body>
        </html>
    `;
    
};