import * as vscode from 'vscode';
import { StatusBarConfigs } from './annotations/interfaces';
import { someshaCallback } from './util/callbacks';
import { exclusiveCommands } from './util/commands';

function createStatusBarItem(context: vscode.ExtensionContext, config: StatusBarConfigs){
	let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);

	statusBarItem.command = config.command;
	statusBarItem.tooltip = config.tooltip;
	statusBarItem.text = config.text;

	context.subscriptions.push(statusBarItem);

	statusBarItem.show();
}

export function activate(context: vscode.ExtensionContext) {

	const pdfQuickOpenItem: StatusBarConfigs = {
		command: "soma.somesha",
		text: "Soma",
		tooltip: "Open PDF files"
	};

	createStatusBarItem(context, pdfQuickOpenItem);

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

}

export function deactivate() {}
