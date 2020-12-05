import { assert, expect } from 'chai';
import {getNonce} from "../../util/";

suite('Utils Test Suite', () => {
	test('nonce should return a string', () => {
        let nonce: string = getNonce();
		assert.typeOf(nonce, "string");
	});

	test('nonce should be 32 characters in length', () => {
        let nonce: string = getNonce();
		expect(nonce.length).to.be.equal(32);
	});
});
