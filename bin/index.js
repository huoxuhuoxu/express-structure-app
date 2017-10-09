#!/usr/bin/env node
let exec = require("child_process").exec;
let fs = require("fs");
let path = require("path");


const exec_func = async function(s){
    console.log('正在执行,请稍等...n分钟');
    let timer = setInterval(() => {
        process.stdout.write('-');
    }, 30);
    return new Promise((resolve, reject) => {
        exec(s, function(err, stdout, stderr){
            clearInterval(timer);
            timer = null;
            if(err){
                reject(err);
                return ;
            }
            resolve();
        });
    });
};

// 检测文件夹是否存在
const exists_dirname = async function(s){
    return new Promise((resolve, reject) => {
        fs.stat(s, (err, stats) => {
            if(err){
                console.log("不存在同名文件夹/文件,可以继续创建");
                resolve();
                return ;
            }
            if(stats.isDirectory()){
                reject(`文件目录 ${s} 已存在,请更换`);
                return ;
            }
            resolve();
        });
    });
};

const MAIN = async () => {
    let argvs = process.argv.slice(2);
    let sProjectName = 'expressApiServer';
    if(argvs.length && typeof argvs[0] === "string"){
        sProjectName = argvs[0];
    }

    let sAllPath = path.join(process.cwd(), sProjectName);
    await exists_dirname(sAllPath);
    await exec_func(`git clone https://github.com/huoxuhuoxu/node-api-server.git ${sAllPath}`);
    await exec(`rm -rf ${sAllPath || './bin'}/.git`, () => {});

    console.log("\r\n项目名称为: %s", sProjectName);
};

// start
(async () => {

    if(!module.parent){
        try{
            await MAIN();
            console.log("项目初始化成功,请阅读项目文件:README.md,开始你的旅程...");
        }catch(err){
            console.log("项目初始化失败: \r\n \t%s", err.toString());
        };
    }

})();
