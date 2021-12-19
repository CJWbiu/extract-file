const path = require('path');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');
const json = require('@rollup/plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const pkg = require('./package.json');

const resolveFile = function(filePath) {
    return path.join(__dirname, filePath)
}
const extensions = ['.js', '.ts'];

const plugins = [
    nodeResolve({
        extensions,
        modulesOnly: true
    }),
    commonjs(),
    json(),
    builtins(),
    babel({
        extensions,
        exclude: 'node_modules/**'
    }),
    terser()
];

module.exports = [
    {
        input: resolveFile('./src/index.ts'),
        output: {
            file: resolveFile(pkg.main),
            format: 'cjs'
        },
        plugins
    },
    {
        input: resolveFile('./src/cli.ts'),
        output: {
            file: resolveFile(pkg.bin.extract),
            format: 'cjs',

            // 添加顶部注释
            banner: '#!/usr/bin/env node'
        },
        plugins
    }
];