#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';

const runCommand = command => {
	try {
		execSync(command, {stdio: 'inherit'})
	} catch (error) {
		console.error(chalk.red(`Failed to execute ${command}`, error));
		return false;
	}
	return true;
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/Selina-Finance/mf-client-template.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && yarn install`;

console.log(chalk.bgBlue(`Cloning the repository with name ${repoName}`));
const checkOut = runCommand(gitCheckoutCommand);
if (!checkOut) {
	console.error(chalk.red('Failed to clone the repository'));
	process.exit(1);
}

console.log(chalk.bgBlue('Installing dependencies'));
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
	console.error(chalk.red('Failed to install dependencies'));
	process.exit(1);
}

console.log(chalk.bgGreen('Congratulations everything is ready'));
console.log(chalk.bgGreen(`cd ${repoName} && yarn start`));
