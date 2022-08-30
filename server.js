import path from 'path';
import chokidar from 'chokidar';
import esbuild from 'esbuild';
import chalk from 'chalk';

const watchDirectories = [
  "./app/**/*.js",
]

const config = {
  entryPoints: ["main.js"],
  outdir: path.join(process.cwd(), "build"),
  absWorkingDir: path.join(process.cwd(), "app/scripts"),
  watch: process.argv.includes("--watch"),
  sourcemap: process.argv.includes("--watch"),
  incremental: process.argv.includes("--watch"),
  plugins: [],
  bundle: true,
  minify: true,
}

init();
async function init(){
    await buildJS();
    chokidar.watch(watchDirectories).on('all', (event, path) => rebuildJS(path));
}

function debounce(cb, delay = 100) {
    let timeout
  
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

const delayedBuild = debounce(()=>buildJS()); 
async function buildJS(){
    try{
        await esbuild.build(config);
        console.log(chalk.bgYellow.bold(' ESbuild ')+chalk.green(' Success'));
        console.log(chalk.bgCyan.bold(' Server  ') + chalk.blue(' Watching...'));
    } catch(e) {
        console.log(chalk.bgYellow.bold(' ESbuild ')+ chalk.red(' Fail'));
        console.log(chalk.bgCyan.bold(' Server  ')+ chalk.blue(' Watching...'));
    }

}

async function rebuildJS(path){
    console.log(chalk.bgWhite.bold(' Change  ')+ ' ' + path);
    await delayedBuild();
}