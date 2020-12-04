import * as vscode from 'vscode';
import { assert, expect } from 'chai';

suite('Extension Test Suite', () => {
    const extensionName: string = "brian-njogu.soma";
    const actualExtension: vscode.Extension<any> | undefined = vscode.extensions.getExtension(extensionName);

	test('Extension should exist', () => {
        expect(actualExtension).to.not.equal(undefined);
    });

    test("Extension should activate", function(){
        this.timeout(1 * 60 * 1000);
        return actualExtension?.activate()
            .then((_) => assert.ok(true));
    });
});
