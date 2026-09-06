import chalk from './index.js';

/**
A set of ready-to-use themes. Each key is a free-form style name; the value
can be any Chalk style — built-in colors, chained modifiers, hex/rgb/ansi256
styles, or background-color variants. Use the `fg:`/`bg:`/`mod:` prefixes
by convention to keep foreground colors, background colors, and modifiers
easy to scan.

@example
```
import chalk, {builtinThemes} from 'chalk';

chalk.defineTheme('light', builtinThemes.light);
chalk.theme('light');
console.log(chalk.theme().primary('Hello'));
```
*/
export const builtinThemes = {
	light: {
		// Foreground colors
		primary: chalk.blue,
		success: chalk.green,
		error: chalk.red,
		warning: chalk.hex('#FFA500'),
		info: chalk.blue,
		muted: chalk.gray,

		// Background colors
		bgPrimary: chalk.bgBlue,
		bgSuccess: chalk.bgGreen,
		bgError: chalk.bgRed,
		bgWarning: chalk.bgHex('#FFE4B5'),
		bgInfo: chalk.bgCyan,

		// Modifiers
		strong: chalk.bold,
		emphasis: chalk.italic,
		underline: chalk.underline,
	},
	dark: {
		// Foreground colors
		primary: chalk.cyan,
		success: chalk.greenBright,
		error: chalk.redBright,
		warning: chalk.yellow,
		info: chalk.cyanBright,
		muted: chalk.gray,

		// Background colors
		bgPrimary: chalk.bgCyan,
		bgSuccess: chalk.bgGreenBright,
		bgError: chalk.bgRedBright,
		bgWarning: chalk.bgYellow,
		bgInfo: chalk.bgCyanBright,

		// Modifiers
		strong: chalk.bold,
		emphasis: chalk.italic,
		underline: chalk.underline,
	},
};

export default builtinThemes;
