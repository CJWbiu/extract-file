import { program } from 'commander';
import { extractFiles } from './index';
import { validParams } from './util/validator';
import { MODE } from './enum';
import { version } from '../package.json';
import { ExtractParams } from './interface';

function getCommandOpts () {
    program
        .version(version)
        .requiredOption('-s, --src <srcPath>', '源文件夹', process.cwd())
        .requiredOption('-d, --dest <destPath>', '目标文件夹')
        .requiredOption('-r, --rules <rules>', '规则')
        .requiredOption('-m, --mode <mode>', '提取模式', MODE.filter)
        .parse();
    
    return program.opts() as ExtractParams;
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