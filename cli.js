#!/usr/bin/env node

const { program } = require('commander');
const { extractFiles } = require('./index');
const { validParams } = require('./util/validator');
const { MODE } = require('./const');
const { version } = require('./package.json');

function getCommandOpts () {
    program
        .version(version)
        .requiredOption('-s, --src <srcPath>', '源文件夹', process.cwd())
        .requiredOption('-d, --dest <destPath>', '目标文件夹')
        .requiredOption('-r, --rules <rules>', '规则')
        .requiredOption('-m, --mode <mode>', '提取模式', MODE.filter)
        .parse();
    
    return program.opts();
}

function main () {
    const config = getCommandOpts();
    const { isValid, msg } = validParams(config);

    if (!isValid) {
        console.log(msg);
        return;
    }

    extractFiles(config);
}

main();