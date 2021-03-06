#!/usr/bin/env node
const fs = require('fs');
const clone = require('git-clone');
const program = require('commander');
const shell = require('shelljs');
const qoa = require('qoa');
const chalk = require('chalk');

const log = console.log;
shell.exec('clear');

const questionsList = [
  {
    type: 'input',
    query: 'Type your projectName:',
    handle: 'projectName'
  },
  {
    type: 'input',
    query: 'Type your author:',
    handle: 'author'
  },
  {
    type: 'input',
    query: 'Type your description:',
    handle: 'description'
  }
];

qoa.prompt(questionsList).then(answer => {
  const { projectName, author, description } = answer;
  shell.exec('clear');

  const folder_exists = fs.existsSync(`./${projectName}`);
  if (folder_exists) {
    log(chalk.red('该文件已存在！'));
    return;
  }

  log(chalk.blue(`正在当前目录下创建${projectName}文件夹...`));

  if (projectName) {
    let pwd = shell.pwd();
    log(chalk.blue(`正在拉取模板代码，下载位置：${pwd}/${projectName}/ ...`));
    clone(
      'https://github.com/WKlili/ant-design-template.git',
      pwd + `/${projectName}`,
      null,
      function() {
        shell.rm('-rf', pwd + `/${projectName}/.git`);
        shell.rm('-rf', pwd + `/${projectName}/docs`);

        shell.cd(projectName);

        shell.sed('-i', 'WKlili', author, 'package.json');
        shell.sed(
          '-i',
          'ant-design-template-description',
          description,
          'package.json'
        );
        shell.sed(
          '-i',
          'ant-design-template',
          projectName,
          'package.json'
        );

        shell.sed(
          '-i',
          'ant-design-template',
          projectName,
          'public/index.html'
        );
        shell.sed(
          '-i',
          'ant-design-template',
          projectName,
          '.env.development'
        );
        shell.sed(
          '-i',
          'ant-design-template',
          projectName,
          '.env.production'
        );
        shell.sed(
          '-i',
          'ant-design-template',
          projectName,
          '.env.staging'
        );

        log(chalk.green('正在安装依赖，请稍后...'));

        shell.exec('npm i', function(code) {
          log(chalk.green('模板工程建立完成！'));
          shell.exit();
        });
      }
    );
  }
});

program.parse(process.argv);
