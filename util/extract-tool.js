const path = require('path');
const fs = require('fs');
const Validator = require('./validator');

class ExtractTool {
    constructor (config) {
        let { isValid, msg } = this.__isValid(config);

        if (!isValid) {
            throw new Error(msg);
        }

        this.config = { ...config };
    }

    /**
     * 提取文件
     */
    extractFiles () {
        let { src, dest, rules, type } = this.config;

        this.traverseDir(src, (file) => {
    
            if (this.__isIgnore(rules, file, type)) {
                return;
            }
    
            this.moveFile(file, dest);
        });
    }

    /**
     * 遍历文件夹所有文件
     * @param {String} dirPath 
     * @param {Function} callback 
     */
    traverseDir (dirPath, callback) {
        let files = [];

        try {
            files = fs.readdirSync(dirPath);
        } catch (error) {
            console.log(`读取文件夹${dirPath}失败：error`);
            return;
        }

        files.forEach(file => {
            let filePath = path.join(dirPath, file);

            try {
                let stat = fs.statSync(filePath);   
                
                if (stat.isDirectory()) {
                    this.traverseDir(filePath, callback);
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
    moveFile (file, dest) {
        let readStream = fs.createReadStream(file);

        readStream.pipe(fs.createWriteStream(path.join(dest, path.basename(file))));
        readStream.on('end', () => {
            console.log(`拷贝文件${file}成功！`);
        });
        readStream.on('error', (error) => {
            console.log(`拷贝文件${file}失败：${error}！`);
        });
    }

    /**
     * 是否排除该文件
     * @param {String} rules 
     * @param {String} file 
     * @param {String} type filter|ignore
     * @returns {Boolean}
     */
    __isIgnore (rules, file, type = 'filter') {
        if (!rules) {
            return false;
        }

        rules = (rules || '').split(',');

        let ext = path.extname(file).slice(1);

        if (type === 'ignore') {
            return rules.includes(ext);
        }

        if (type === 'filter') {
            return !rules.includes(ext);
        }

        return true;
    }

    /**
     * 校验配置
     * @param {Object} config 
     * @returns {Boolean}
     */
    __isValid (config) {
        let validConfig = {
            src: {
                validFn: Validator.validSrcPath,
                required: true
            },
            dest: {
                validFn: Validator.validDestPath,
                required: true
            },
            type: {
                validFn: Validator.validType,
            },
            rules: {
                validFn: Validator.validRules
            }
        };

        // 校验必填项
        let validRequired = Validator.validRequired(config, validConfig);
        
        if (!validRequired.isValid) {
            return validRequired;
        }
        
        let result = [];

        Object.keys(config).forEach(key => {
            let { validFn } = validConfig[key];
        
            if (validFn && config[key]) {
                let { isValid, msg } = validFn(config[key]);

                if (!isValid) {
                    result.push(msg);
                }
            }
        });

        if (result.length) {
            return {
                isValid: false,
                msg: `参数填写错误：\n ${result.join('\n')}`
            };
        }
        
        return { isValid: true };
    }
}

module.exports = ExtractTool;