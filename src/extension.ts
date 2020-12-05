import * as vscode from 'vscode';
import { someshaCallback } from './util/callbacks';
import { exclusiveCommands } from './util/commands';

export function activate(context: vscode.ExtensionContext) {
	let pdfQuickOpenStatusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);;

	pdfQuickOpenStatusBarItem.command = "soma.somesha";
	pdfQuickOpenStatusBarItem.tooltip = "Open PDF files";
	pdfQuickOpenStatusBarItem.text = "Soma";

	context.subscriptions.push(pdfQuickOpenStatusBarItem);

	for(let key of Object.keys(exclusiveCommands)){
		
		let callback = (): void => {};
		let command: string = exclusiveCommands[key];
		
		switch(command){
			case "soma.somesha":
				callback = () => someshaCallback(context);
				break;
		}

		let disposable: vscode.Disposable = vscode.commands.registerCommand(command, callback);

		context.subscriptions.push(disposable);

	}

	pdfQuickOpenStatusBarItem.show()

}

export function deactivate() {}
