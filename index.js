const path = require('path');
const fs = require('fs');
const ExtractTool = require('./util/extract-tool');
const { formatterArgs } = require('./util/formatter');
const { isDirectory } = require('./util/validator');

function emptyDir (pathName, rmdir) {
    let files = [];

    if (fs.existsSync(pathName)) {
        try {
            files = fs.readdirSync(pathName);
        } catch (error) {
            console.log(`读取文件夹${pathName}失败：${error}`);
            return;
        }

        files.forEach((file) => {
            let curPath = pathName + "/" + file;

            if (isDirectory(curPath)) {
                emptyDir(curPath);
            } else {
                try {
                    fs.unlinkSync(curPath);
                } catch (error) {
                    console.log(`删除文件${curPath}失败：${error}`);
                    return;
                }
            }
        });
        
        try {
            rmdir && fs.rmdirSync(pathName);
        } catch (error) {
            console.log(`删除文件夹${pathName}失败：${error}`);
        }
    }
}

function doEmpty (args) {
    let errMsg = `指令错误，如果想执行empty操作，指令如下：node index empty [pathName] --rmdir`;

    if (args[0] !== 'empty') {
        console.log(errMsg);
        return;
    }

    let pathName = args[1];

    if (!isDirectory(pathName)) {
        console.log(`请输入正确的文件夹路径！`);
        return;
    }

    let rmdir = args[2] === '--rmdir';

    emptyDir(pathName, rmdir);
}

function main () {
    let args = process.argv.splice(2);

    // 执行清空操作
    if (args.includes('empty')) {
        doEmpty(args);
        return;
    }

    let argConfig = formatterArgs(args);

    if (!argConfig.valid) {
        console.log(argConfig.errText);
        return;
    }

    let defaultConfig = {};
    
    try {
        defaultConfig = fs.readFileSync('./config.json', 'utf-8');
        defaultConfig = JSON.parse(defaultConfig);
    } catch (error) {
        console.log(`获取默认配置失败：${error}`);
    }
    
    let config = {
        ...defaultConfig,
        ...argConfig.data
    };

    let extractTool;

    try {
        extractTool = new ExtractTool(config);
    } catch (error) {
        console.log(`初始化工具失败：${error.message}`);
        return;
    }

    extractTool.extractFiles();
}

main();