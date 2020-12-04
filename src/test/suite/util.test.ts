import { assert, expect } from 'chai';
import {getNonce} from "../../util/";

suite('Utils Test Suite', () => {
	test('getNonce should return a 32 character string', () => {
        let nonce: string = getNonce();
		assert.typeOf(nonce, "string");
		expect(nonce.length).to.be.equal(32);
	});
});
