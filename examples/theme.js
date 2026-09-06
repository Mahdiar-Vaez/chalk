import chalk from '../source/index.js';

chalk.level = 3;

// A theme is a plain object — each value is any Chalk style.
// By convention, `fg:` / `bg:` / `mod:` prefixes (or `text`/`bgText`/`bold`
// naming) keep foreground colors, background colors, and modifiers easy to
// scan. Naming is otherwise free.
chalk.defineTheme('light', {
	// Foreground colors
	primary: chalk.blue,
	success: chalk.green,
	error: chalk.red,
	warning: chalk.hex('#FFA500'),

	// Background colors
	bgPrimary: chalk.bgBlue,
	bgError: chalk.bgRed,
	bgSuccess: chalk.bgGreenBright,

	// Modifiers
	strong: chalk.bold,
	emphasis: chalk.italic,
});

chalk.defineTheme('dark', {
	// Foreground colors
	primary: chalk.cyan,
	success: chalk.greenBright,
	error: chalk.redBright,
	warning: chalk.yellow,

	// Background colors
	bgPrimary: chalk.bgCyan,
	bgError: chalk.bgRedBright,
	bgSuccess: chalk.bgGreen,

	// Modifiers
	strong: chalk.bold,
	emphasis: chalk.italic,
});

const render = () => {
	const styles = chalk.theme();
	console.log(`${styles.primary('Primary')}  ${styles.success('OK')}  ${styles.warning('WARN')}  ${styles.error('ERR')}`);
	console.log(`${styles.bgPrimary(' Header ')}  ${styles.bgError(' Alert ')}  ${styles.bgSuccess(' Done ')}`);
	console.log(`${styles.strong('Bold text')}  ${styles.emphasis('italic text')}`);
};

console.log('-- light theme --');
chalk.theme('light');
render();

console.log('\n-- dark theme --');
chalk.theme('dark');
render();

// Add a new key to an existing theme — useful when the theme grows over time.
chalk.defineTheme('dark', {highlight: chalk.bgYellow.black});
const darkStyles = chalk.theme();
console.log('\n-- dark theme with new "highlight" key --');
console.log(darkStyles.highlight(' Notice '));

// Pass null to clear the active theme.
chalk.theme(null);
console.log('\n-- no theme --');
console.log('theme() =', chalk.theme());
