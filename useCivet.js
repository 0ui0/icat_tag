const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// 定义处理文件变动的函数
function handleFileChange(filePath) {
  if (path.extname(filePath) === '.civet') {
    // 执行编译命令
    const command = `civet --js -c ${filePath} -o .js`;
    exec(command, (error, stdout, stderr) => {
      console.log("已编译:"+ path.join(__dirname,filePath))
      if (error) {
        console.error(`Error executing command: ${error}`);
        return;
      }
      
      if(stdout)console.log(`stdout: ${stdout}`);
      if(stderr)console.error(`stderr: ${stderr}`);
    });
  }
}

// 初始化Chokidar观察者
const watcher = chokidar.watch('.', {
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件和目录
  persistent: true,
  recursive: true, // 递归监控子目录
  ignoreInitial:false,
});

// 添加文件变动事件处理器
watcher.on('add', handleFileChange);
watcher.on('change', handleFileChange);

console.log('Now watching for .civet file changes...');

// 当程序退出时，关闭文件观察者
process.on('SIGINT', () => {
  watcher.close();
  console.log('Stopped watching for file changes.');
  process.exit(0);
});