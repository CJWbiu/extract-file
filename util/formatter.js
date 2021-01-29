/**
 * 解析控制台参数
 * @param {Array} args 
 * @returns {Object}
 */
exports.formatterArgs = (args) => {
    let result = {
        valid: true,
        data: {},
        errText: ''
    };

    if (!args.length) {
        return result;
    }

    let data = {};

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        let match = /^(\w+)=([\w,-]+)$/.exec(arg);

        if (!match) {
            result.errText = `参数格式错误，请正确填写，例如：src=./test`;
            result.valid = false;
            return result;
        }

        data[match[1]] = match[2];
    }

    result.data = data;
    return result;
}