const { TestScheduler } = require('jest');
const ExtractTool = require('../util/extract-tool');
const path = require('path');

describe('检测提取工具', () => {
    test('构造函数测试', () => {
        let tool = new ExtractTool({
            "src": path.resolve(__dirname, '../test'),
            "dest": path.resolve(__dirname, '../util'),
            "rules": "ini",
            "type": "filter"
        });

        expect(tool.config).toMatchObject({
            "src": expect.stringMatching(/[\w\\]+/),
            "dest": expect.stringMatching(/[\w\\]+/),
            "rules": "ini",
            "type": "filter"
        });
    });
});