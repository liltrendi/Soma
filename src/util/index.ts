import { Scripts } from "../interfaces";

export const getNonce = (): string => {
	let text = '';
	const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
	}
	return text;
}

export const getHtmlDocument = (config: Scripts): string => {
    
    let {webview, mainScriptUri, mainStylesUri} = config;
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
                <link href="${mainStylesUri}" rel="stylesheet">
                <title>Soma</title>
            </head>
            <body>
                <h1 id="lines-of-code-counter">
                    Soma Webview
                </h1>
                <script nonce="${nonce}" src="${mainScriptUri}"></script>
            </body>
        </html>
    `;
    
}