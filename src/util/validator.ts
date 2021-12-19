import fs from 'fs';
import { MODE } from '../enum';
import { ExtractParams } from '../interface';

interface ValidConfig {
    [x: string]: {
        validFn: (param: any) => { isValid: boolean, msg?: string },
        required?: boolean
    }
}
type ExtractParamsKey = keyof ExtractParams;

function isDirectory (pathName: string) {
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

function validSrcPath (pathName: string) {
    if (isDirectory(pathName)) {
        return { isValid: true };
    } 
    
    return {
        isValid: false,
        msg: `源路径（src）${pathName}不是文件夹`
    };
}

function validDestPath (pathName: string) {
    if (isDirectory(pathName)) {
        return { isValid: true };
    } 
    
    return {
        isValid: false,
        msg: `目标路径（dest）${pathName}不是文件夹`
    };
}

function validRules (rules: string) {
    let pattern = /^[a-zA-Z]+(,[a-zA-Z]+){0,}$/;

    if (!pattern.test(rules)) {
        return {
            isValid: false,
            msg: `rules格式不正确，正确格式如下：js,ts,ini`
        };
    }

    return { isValid: true };
}

function validMode (mode: MODE) {
    const supportVals = Object.values(MODE);
    return supportVals.includes(mode) ?
        { isValid: true } :
        { 
            isValid: false, 
            msg: `mode只支持${supportVals.join('，')}` 
        };
}

function validRequired (
    config: ExtractParams, 
    validConfig: ValidConfig
) {
    let result: string[] = [];

    Object.keys(config).forEach(key => {
        let { required } = validConfig[key];

        if (required && !config[key as ExtractParamsKey]) {
            result.push(key);
        }
    });

    return result.length ? 
        {
            isValid: false,
            msg: `缺失必要参数：${result.join(',')}`
        } : 
        { isValid: true };
}

/**
 * 校验配置
 * @param {Object} config 
 * @returns {Boolean}
 */
function validParams (config: ExtractParams) {
    const validConfig: ValidConfig = {
        src: {
            validFn: validSrcPath,
            required: true
        },
        dest: {
            validFn: validDestPath,
            required: true
        },
        mode: {
            validFn: validMode,
        },
        rules: {
            validFn: validRules,
            required: true
        }
    };

    // 校验必填项
    const validRes = validRequired(config, validConfig);
    
    if (!validRes.isValid) {
        return validRes;
    }
    
    let result: string[] = [];

    Object.keys(config).forEach(key => {
        const { validFn } = validConfig[key];
        const configVal = config[key as ExtractParamsKey];
    
        if (validFn && configVal) {
            let { isValid, msg } = validFn(configVal);

            if (!isValid) {
                result.push(msg || '');
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

export {
    isDirectory,
    validSrcPath,
    validDestPath,
    validRules,
    validMode,
    validRequired,
    validParams
};