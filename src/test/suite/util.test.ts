import { assert, expect } from 'chai';
import {getNonce, getWebviewPanelTitle} from "../../util/";
import { OpenedPdfFile } from "../../annotations/interfaces";

suite('Utils Test Suite', () => {
	test('nonce should return a string', () => {
        let nonce: string = getNonce();
		assert.typeOf(nonce, "string");
	});

	test('nonce should be 32 characters in length', () => {
        let nonce: string = getNonce();
		expect(nonce.length).to.be.equal(32);
	});

	test('panelTitle should be the name of the pdf', () => {
		let file: OpenedPdfFile = {path: "/somePath/example.pdf"};
		let panelTitle: string = getWebviewPanelTitle(file);
		assert.equal(panelTitle, "example");
	});

	test('panelTitle should be \Soma\ if file is undefined', () => {
		let file: undefined = undefined;
		let panelTitle: string = getWebviewPanelTitle(file);
		assert.equal(panelTitle, "Soma");
	});

	test('panelTitle should be \Soma\ if .pdf extension not in path', () => {
		let file: OpenedPdfFile = {path: "/somePath/example"};
		let panelTitle: string = getWebviewPanelTitle(file);
		assert.equal(panelTitle, "Soma");
	});
});
