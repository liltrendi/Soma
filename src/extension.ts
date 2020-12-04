import * as vscode from 'vscode';
import { someshaCallback } from './callbacks';
import { exclusiveCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {

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
