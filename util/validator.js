const fs = require('fs');

function isDirectory (pathName) {
    try {
        let stat = fs.statSync(pathName);

        if (stat.isDirectory()) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
} 

function validSrcPath (pathName) {
    if (isDirectory(pathName)) {
        return { isValid: true };
    } 
    
    return {
        isValid: false,
        msg: `源路径（src）${pathName}不是文件夹`
    };
}

function validDestPath (pathName) {
    if (isDirectory(pathName)) {
        return { isValid: true };
    } 
    
    return {
        isValid: false,
        msg: `目标路径（dest）${pathName}不是文件夹`
    };
}

function validRules (rules) {
    let pattern = /^[a-z]{2,}(,[a-z]{2}){0,}$/;

    if (!pattern.test(rules)) {
        return {
            isValid: false,
            msg: `rules格式不正确，正确格式如下：js,ts,ini`
        };
    }

    return { isValid: true };
}

function validType (type) {
    return ['filter', 'ignore'].includes(type) ?
        { isValid: true } :
        { 
            isValid: false, 
            msg: `type只支持filter或ignore` 
        };
}

function validRequired (config, validConfig) {
    let result = [];

    Object.keys(config).forEach(key => {
        let { required } = validConfig[key];

        if (required && !config[key]) {
            result.push(key);
        }
    });

    return result.length ? 
        {
            isValid: false,
            msg: `缺失必要参数：${missings.join(',')}`
        } : 
        { isValid: true };
}

module.exports = {
    isDirectory,
    validSrcPath,
    validDestPath,
    validRules,
    validType,
    validRequired
};