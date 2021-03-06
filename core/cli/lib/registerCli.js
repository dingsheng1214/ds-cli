'use strict';

const log = require('@ds-cli/log')
const init = require('@ds-cli/init')
const exec = require('@ds-cli/exec')
const colors = require('colors/safe')
const pkg = require('../package.json')

const { Command } = require('commander');
const program = new Command()

// 脚手架注册
function registerCli() {
    addGlobalConfig()
    addCommands()
    addListeners()

    // 解析参数
    program.parse(process.argv);

    if (program?.args?.length < 1) {
        program.outputHelp()
        console.log()
    }
}

// 监听事件
function addListeners() {
    // 监听 debug模式
    program.on('option:debug', () => {
        process.env.LOG_LEVEL =  (program.opts?.()?.debug ?? false) ? 'verbose' : 'info'
        log.level = process.env.LOG_LEVEL
        log.verbose('debug test')
    });
    // 监听targetPath
    program.on('option:targetPath', () => {
        process.env.CLI_TARGET_PATH = program.opts().targetPath
        log.info('target path', program.opts().targetPath)
    });
    // 未知命令监听
    program.on('command:*', function (args){
        console.log(colors.red(`未知命令：${args}`))
        const availableCommands = program.commands.map(command => command.name())
        if (availableCommands.length > 0) {
            console.log(colors.green(`可用命令： ${availableCommands}`))
        }
    });
}
// 添加命令
function addCommands() {
    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec);
}
// 脚手架配置
function addGlobalConfig() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');
}

module.exports = registerCli
