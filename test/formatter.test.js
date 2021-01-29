const { formatterArgs } = require('../util/formatter');

describe('校验参数解析', () => {
    test('无参数测试', () => {
        expect(formatterArgs([]).valid).toBeTruthy();
    });

    test('错误格式测试', () => {
        expect(formatterArgs(['src = "abc"']).valid).toBeFalsy();
    });

    test('正确格式测试', () => {
        expect(formatterArgs(['rules=ts,js']).valid).toBeTruthy();
    });
    test('正确格式测试', () => {
        expect(formatterArgs(['src=test-dir']).valid).toBeTruthy();
    });
});