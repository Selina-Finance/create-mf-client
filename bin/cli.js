#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import replace from 'replace-in-file';

const runCommand = command => {
	try {
		execSync(command, { stdio: 'inherit' })
	} catch (error) {
		console.error(chalk.red(`Failed to execute ${command}`, error));
		return false;
	}
	return true;
}

const appName = process.argv[2];
const moduleName = process.argv[3];
const port = process.argv[4];
if (!port || !appName || !moduleName) {
	console.error(chalk.red('Please provide the app name, module name and port npx @selina-finance/create-mf-client <app-name> <module-name> <port>'));
	process.exit(1);
}
const repoName = `mf-${appName}-${moduleName}`;
const gitCheckoutCommand = `git clone --depth 1 --quiet https://github.com/Selina-Finance/mf-client-template.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && yarn --silent`;
const removeGit = `cd ${repoName} && rm -rf .git`;

console.log(chalk.bgBlue(`Cloning the repository with name ${repoName}`));
const checkOut = runCommand(gitCheckoutCommand);
if (!checkOut) {
	console.error(chalk.red('Failed to clone the repository'));
	process.exit(1);
}

console.log(chalk.bgBlue('Update package.json '));
try {
	replace.sync({
		files: `${repoName}/package.json`,
		from: [/app_name/g, /module_name/g],
		to: [appName, moduleName],
	});
}
catch (error) {
	console.error(chalk.red('Failed to update package.json'));
	process.exit(1);
}

console.log(chalk.bgBlue('Update webpack config.js'));
try {
	replace.sync({
		files: `${repoName}/webpack_config/config.json`,
		from: [/app_name/g, /module_name/g, /port_number/g],
		to: [appName, moduleName, port],
	});
}
catch (error) {
	console.error(chalk.red('Failed to update config.js'));
	process.exit(1);
}

console.log(chalk.bgBlue('Installing dependencies'));
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
	console.error(chalk.red('Failed to install dependencies'));
	process.exit(1);
}

console.log(chalk.bgBlue('Removing git folder'));
const gitRemoved = runCommand(removeGit);
if (!gitRemoved) {
	console.error(chalk.red('Failed to remove .git folder'));
	process.exit(1);
}

console.log(chalk.bgGreen('Congratulations everything is ready'));
console.log(chalk.bgGreen(`cd ${repoName} && yarn start`));
