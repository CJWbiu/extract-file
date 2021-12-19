const path = require('path');
const Validator = require('../util/validator');

describe('校验isDirectory', () => {
    let { isDirectory } = Validator;
    test('错误路径测试', () => {
        expect(isDirectory('xxx')).toBeFalsy();
    });
    test('正确文件夹路径测试', () => {
        expect(isDirectory(path.resolve(__dirname, '../test'))).toBeTruthy();
    });
    test('正确文件路径测试', () => {
        expect(isDirectory(path.resolve(__dirname, '../index.js'))).toBeFalsy();
    });
});

describe('校验validRules', () => {
    let { validRules } = Validator;
    test('错误分隔符测试: -', () => {
        expect(validRules('js-ts').isValid).toBeFalsy();
    });
    test('错误分隔符测试: .', () => {
        expect(validRules('js.ts').isValid).toBeFalsy();
    });
    test('正确分隔符测试: ,', () => {
        expect(validRules('jpg,psd').isValid).toBeTruthy();
    });
    test('单个错误格式测试: ,js', () => {
        expect(validRules(',js').isValid).toBeFalsy();
    });
    test('单个错误格式测试: j_s', () => {
        expect(validRules('j_s').isValid).toBeFalsy();
    });
    test('多个错误格式测试: ts,_js,t.s', () => {
        expect(validRules('ts,_js,t.s').isValid).toBeFalsy();
    });
    test('单个正确格式测试: ts', () => {
        expect(validRules('ts').isValid).toBeTruthy();
    });
});

describe('校验validMode', () => {
    let { validMode } = Validator;
    test('传入正确值测试：filter', () => {
        expect(validMode('filter').isValid).toBeTruthy();
    });
    test('传入正确值测试：ignore', () => {
        expect(validMode('ignore').isValid).toBeTruthy();
    });
    test('传入正确值测试：xxx', () => {
        expect(validMode('xxx').isValid).toBeFalsy();
    });
});