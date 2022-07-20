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

const repoName = `mf-${appName}-${moduleName}`;

const gitCheckoutCommand = `git clone --depth 1 https://github.com/Selina-Finance/mf-client-template.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && yarn install`;

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
		from: [/##appName##/g, /##moduleName##/g],
		to: [appName, moduleName],
	});
}
catch (error) {
	console.error(chalk.red('Failed to update package.json'));
	process.exit(1);
}

console.log(chalk.bgBlue('Update config.js'));
try {
	replace.sync({
		files: `${repoName}/config/config.json`,
		from: [/##appName##/g, /##moduleName##/g, /##port##/g],
		to: [appName, moduleName],
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

console.log(chalk.bgGreen('Congratulations everything is ready'));
console.log(chalk.bgGreen(`cd ${repoName} && yarn start`));
