// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { EOL } from 'os';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as Velocity from 'velocityjs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "create-file-from-template" is now active!');

	const globalStoragePath: string = context.globalStoragePath;

	console.log(globalStoragePath);

	vscode.window.showInformationMessage(globalStoragePath);

	if (!fs.existsSync(globalStoragePath)){
		fs.mkdirSync(globalStoragePath);
	}

	const openTemplate = (fname: string) => {
		var openPath = vscode.Uri.file(globalStoragePath + '/' + fname);
		vscode.workspace.openTextDocument(openPath).then(doc => {
			vscode.window.showTextDocument(doc);
		}, (error: any) => {
			console.error(error);
		});
	};

	Array.prototype.push.apply(context.subscriptions, [
		vscode.commands.registerCommand('create-file-from-template.createFile', async (folder: any) => {
			console.log(folder.fsPath);

			const files = glob.sync(globalStoragePath + '/*');
			const filenames = files.map(file => {
				const parts = file.split('/');
				return parts[parts.length - 1];
			});
			const chosenFile = await vscode.window.showQuickPick(filenames, {
				placeHolder: 'Please select template: ',
			});
			if (!chosenFile) {
				vscode.window.showInformationMessage('Canceled create!');
				return;
			}
			const name = await vscode.window.showInputBox({
				placeHolder: 'Please input file name, not include file extensions'
			});
			if (!name) {
				vscode.window.showInformationMessage('Canceled create!');
				return;
			}
			const template = await fs.promises.readFile(
				path.join(globalStoragePath, chosenFile),
				'utf-8'
			);
			let $injected = null;
			if (template.includes('$injected') || template.includes('${injected}')) {
				$injected = await vscode.window.showInputBox({
					placeHolder: 'Please input $injected variable'
				});
			}

			const renderedString = Velocity.render(template, {
				name,
				injected: $injected,
			});

			const extemsion = chosenFile.split('.').slice(1).join('.');
			const filename = `${name}.${extemsion}`;

			await fs.promises.writeFile(
				path.join(folder.fsPath, filename),
				renderedString.trim()
			);
			var openPath = vscode.Uri.file(path.join(folder.fsPath, filename));
			vscode.workspace.openTextDocument(openPath).then(doc => {
				vscode.window.showTextDocument(doc);
			}, (error: any) => {
				console.error(error);
			});
		}),
		vscode.commands.registerCommand('create-file-from-template.createTemplate', async () => {
			const filename = await vscode.window.showInputBox({
				placeHolder: 'Please input file name, include file extensions'
			});

			if (!filename) {
				vscode.window.showInformationMessage('Canceled create!');
				return;
			}
			let demoContent = '// We are using Velocity template, please check its document: http://velocity.apache.org/engine/devel/user-guide.html' + EOL;
			demoContent += '$name is the file name' + EOL;
			demoContent += '$injected is the second input, we will ask it when you have it in template' + EOL;

			await fs.promises.writeFile(globalStoragePath + '/' + filename, demoContent);
			openTemplate(filename);
		}),
		vscode.commands.registerCommand('create-file-from-template.editTemplate', async () => {
			const files = glob.sync(globalStoragePath + '/*');
			const filenames = files.map(file => {
				const parts = file.split('/');
				return parts[parts.length - 1];
			});
			const chosenFile = await vscode.window.showQuickPick(filenames, {
				placeHolder: 'Please select template: ',
			});
			if (!chosenFile) {
				vscode.window.showInformationMessage('Canceled create!');
				return;
			}
			openTemplate(chosenFile);
		}),
		vscode.commands.registerCommand('create-file-from-template.deleteTemplate', async () => {
			const files = glob.sync(globalStoragePath + '/*');
			const filenames = files.map(file => {
				const parts = file.split('/');
				return parts[parts.length - 1];
			});
			const chosenFile = await vscode.window.showQuickPick(filenames, {
				placeHolder: 'Please select template: ',
			});
			if (!chosenFile) {
				vscode.window.showInformationMessage('Canceled create!');
				return;
			}
			await fs.promises.unlink(globalStoragePath + '/' + chosenFile);
			vscode.window.showInformationMessage('Removed template!');
		}),
	]);
}

// this method is called when your extension is deactivated
export function deactivate() {}

