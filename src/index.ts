import path from 'path';
import fs from 'fs';
import { validParams } from './util/validator';
import { MODE } from './enum';
import { ExtractParams } from './interface';

/**
 * 是否排除该文件
 * @param {String} rulesStr 
 * @param {String} file 
 * @param {String} mode filter|ignore
 * @returns {Boolean}
 */
function __isIgnore (
    rulesStr: string, 
    file: string, 
    mode: MODE = MODE.filter
): boolean {
    if (!rulesStr) {
        return false;
    }

    const rules = (rulesStr || '').split(',');
    const ext = path.extname(file).slice(1);

    if (mode === MODE.ignore) {
        return rules.includes(ext);
    }

    if (mode === MODE.filter) {
        return !rules.includes(ext);
    }

    return true;
}

/**
 * 遍历文件夹所有文件
 * @param {String} dirPath 
 * @param {Function} callback 
 */
function traverseDir (
    dirPath: string, 
    callback: (file: string) => void
) {
    if (
        typeof(dirPath) !== 'string' ||
        typeof(callback) !== 'function'
    ) {
        throw new Error('请输入正确的参数！');
    }

    let files = [];

    try {
        files = fs.readdirSync(dirPath);
    } catch (error) {
        console.log(`读取文件夹${dirPath}失败：error`);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(dirPath, file);

        try {
            const stat = fs.statSync(filePath);   
            
            if (stat.isDirectory()) {
                traverseDir(filePath, callback);
                return;
            }

            if (stat.isFile()) {
                callback && callback(filePath);
            }
        } catch (error) {
            console.log(`获取路径stat失败：${error}`);
        }
    });
}

/**
 * 移动文件
 * @param {String} file 
 * @param {String} dest 
 */
function moveFile (file: string, dest: string) {
    if (!file || !dest) {
        throw new Error('参数不能为空！');
    }

    const readStream = fs.createReadStream(file);

    readStream.pipe(fs.createWriteStream(path.join(dest, path.basename(file))));
    readStream.on('end', () => {
        console.log(`拷贝文件${file}成功！`);
    });
    readStream.on('error', (error) => {
        console.log(`拷贝文件${file}失败：${error}！`);
    });
}

/**
 * 提取文件
 * @param {ExtractParams} config 自定义配置
 */
function extractFiles (config: ExtractParams) {
    const { isValid, msg } = validParams(config);

    if (!isValid) {
        throw new Error(msg);
    }

    const { src, dest, rules, mode } = config;

    traverseDir(src, (file) => {

        if (__isIgnore(rules, file, mode)) {
            return;
        }

        moveFile(file, dest);
    });
}

export {
    extractFiles,
    moveFile,
    traverseDir
};