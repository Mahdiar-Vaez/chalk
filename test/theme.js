import test from 'ava';
import chalk, {Chalk} from '../source/index.js';

test.beforeEach(() => {
	chalk.level = 3;
	// Each test should run from a known theme state. Pass `null` to clear any active theme.
	chalk.theme(null);
});

test('defineTheme registers a theme that can be activated', t => {
	chalk.defineTheme('mytheme', {primary: chalk.blue});
	t.notThrows(() => {
		chalk.theme('mytheme');
	});
});

test('theme(name) activates the named theme', t => {
	chalk.defineTheme('mytheme', {
		primary: chalk.blue,
		error: chalk.red,
	});

	const result = chalk.theme('mytheme');
	t.is(result, chalk, 'theme(name) returns the same instance for chaining');
});

test('theme() returns the active theme accessor when a theme is set', t => {
	chalk.defineTheme('mytheme', {primary: chalk.blue});
	chalk.theme('mytheme');

	const accessor = chalk.theme();
	t.not(accessor, undefined);
	t.is(typeof accessor.primary, 'function');
});

test('theme() returns undefined when no theme is active', t => {
	const instance = new Chalk({level: 3});
	t.is(instance.theme(), undefined);
});

test('theme accessor exposes a function for each defined key', t => {
	chalk.defineTheme('mytheme', {
		primary: chalk.blue,
		error: chalk.red,
		success: chalk.green,
	});

	chalk.theme('mytheme');
	const {primary, error, success} = chalk.theme();

	t.deepEqual([primary, error, success].map(fn => typeof fn), ['function', 'function', 'function']);
});

test('the active theme produces the registered ANSI output', t => {
	chalk.defineTheme('mytheme', {primary: chalk.blue});
	chalk.theme('mytheme');

	const {primary} = chalk.theme();
	t.is(primary('Hello'), '\u{1B}[34mHello\u{1B}[39m');
});

test('a theme key can be a foreground color (chalk.blue)', t => {
	chalk.defineTheme('mytheme', {text: chalk.blue});
	chalk.theme('mytheme');

	t.is(chalk.theme().text('x'), '\u{1B}[34mx\u{1B}[39m');
});

test('a theme key can be a background color (chalk.bgBlue)', t => {
	chalk.defineTheme('mytheme', {bgText: chalk.bgBlue});
	chalk.theme('mytheme');

	t.is(chalk.theme().bgText('x'), '\u{1B}[44mx\u{1B}[49m');
});

test('a theme key can be a modifier (chalk.bold)', t => {
	chalk.defineTheme('mytheme', {emphasis: chalk.bold});
	chalk.theme('mytheme');

	t.is(chalk.theme().emphasis('x'), '\u{1B}[1mx\u{1B}[22m');
});

test('a theme key can be a chained style (foreground + modifier)', t => {
	chalk.defineTheme('mytheme', {header: chalk.blue.bold});
	chalk.theme('mytheme');

	// Bold then blue (or vice versa — the chain order is preserved).
	t.is(chalk.theme().header('x'), '\u{1B}[34m\u{1B}[1mx\u{1B}[22m\u{1B}[39m');
});

test('a theme key can be a hex foreground', t => {
	chalk.defineTheme('mytheme', {primary: chalk.hex('#FF0000')});
	chalk.theme('mytheme');

	t.is(chalk.theme().primary('x'), '\u{1B}[38;2;255;0;0mx\u{1B}[39m');
});

test('a theme key can be a hex background', t => {
	chalk.defineTheme('mytheme', {bgHeader: chalk.bgHex('#FFFF00')});
	chalk.theme('mytheme');

	t.is(chalk.theme().bgHeader('x'), '\u{1B}[48;2;255;255;0mx\u{1B}[49m');
});

test('a single theme can mix foreground, background, and modifier keys', t => {
	chalk.defineTheme('mytheme', {
		text: chalk.blue,
		bgText: chalk.bgBlue,
		bold: chalk.bold,
		emphasis: chalk.blue.bold,
		bgError: chalk.bgRed,
		error: chalk.red,
	});

	chalk.theme('mytheme');
	const styles = chalk.theme();

	t.is(styles.text('a'), '\u{1B}[34ma\u{1B}[39m');
	t.is(styles.bgText('b'), '\u{1B}[44mb\u{1B}[49m');
	t.is(styles.bold('c'), '\u{1B}[1mc\u{1B}[22m');
	t.is(styles.emphasis('d'), '\u{1B}[34m\u{1B}[1md\u{1B}[22m\u{1B}[39m');
	t.is(styles.bgError('e'), '\u{1B}[41me\u{1B}[49m');
	t.is(styles.error('f'), '\u{1B}[31mf\u{1B}[39m');
});

test('a theme can be defined incrementally — keys added later still work', t => {
	chalk.defineTheme('mytheme', {text: chalk.blue});
	chalk.theme('mytheme');
	t.is(chalk.theme().text('x'), '\u{1B}[34mx\u{1B}[39m');

	// Add a new key to the existing theme.
	chalk.defineTheme('mytheme', {bgText: chalk.bgBlue, text: chalk.blue});
	const styles = chalk.theme();

	t.is(styles.text('a'), '\u{1B}[34ma\u{1B}[39m');
	t.is(styles.bgText('b'), '\u{1B}[44mb\u{1B}[49m');
});

test('a theme key can be a custom rgb style', t => {
	chalk.defineTheme('mytheme', {primary: chalk.rgb(100, 200, 50)});
	chalk.theme('mytheme');

	t.is(chalk.theme().primary('x'), '\u{1B}[38;2;100;200;50mx\u{1B}[39m');
});

test('a theme key can be a custom bgRgb style', t => {
	chalk.defineTheme('mytheme', {bgPrimary: chalk.bgRgb(100, 200, 50)});
	chalk.theme('mytheme');

	t.is(chalk.theme().bgPrimary('x'), '\u{1B}[48;2;100;200;50mx\u{1B}[49m');
});

test('a theme key can be an underline color (chalk.underlineBlue)', t => {
	chalk.defineTheme('mytheme', {underline: chalk.underlineBlue});
	chalk.theme('mytheme');

	t.is(chalk.theme().underline('x'), '\u{1B}[58;5;4mx\u{1B}[59m');
});

test('switching themes changes the accessor output', t => {
	chalk.defineTheme('light', {primary: chalk.blue});
	chalk.defineTheme('dark', {primary: chalk.cyan});

	chalk.theme('light');
	t.is(chalk.theme().primary('x'), '\u{1B}[34mx\u{1B}[39m');

	chalk.theme('dark');
	t.is(chalk.theme().primary('x'), '\u{1B}[36mx\u{1B}[39m');
});

test('activating an undefined theme throws', t => {
	t.throws(() => {
		chalk.theme('not-registered');
	}, {message: /Theme "not-registered" is not defined/v});
});

test('defineTheme requires a non-empty string name', t => {
	t.throws(() => {
		chalk.defineTheme('', {primary: chalk.blue});
	}, {message: /Theme name must be a non-empty string/v});

	t.throws(() => {
		chalk.defineTheme(undefined, {primary: chalk.blue});
	}, {message: /Theme name must be a non-empty string/v});
});

test('defineTheme requires a plain object of styles', t => {
	t.throws(() => {
		chalk.defineTheme('bad', 'not an object');
	}, {message: /Theme styles must be a plain object/v});

	t.throws(() => {
		chalk.defineTheme('bad', null);
	}, {message: /Theme styles must be a plain object/v});
});

test('defineTheme can be called multiple times to update a theme', t => {
	chalk.defineTheme('mytheme', {primary: chalk.blue});
	chalk.theme('mytheme');
	t.is(chalk.theme().primary('x'), '\u{1B}[34mx\u{1B}[39m');

	chalk.defineTheme('mytheme', {primary: chalk.red});
	t.is(chalk.theme().primary('x'), '\u{1B}[31mx\u{1B}[39m');
});

test('themes are isolated per Chalk instance', t => {
	const instance = new Chalk({level: 3});
	const otherInstance = new Chalk({level: 3});

	instance.defineTheme('mine', {primary: chalk.blue});
	t.notThrows(() => {
		instance.theme('mine');
	});

	t.throws(() => {
		otherInstance.theme('mine');
	}, {message: /Theme "mine" is not defined/v});
});

test('a Chalk instance can use its own themes independently', t => {
	const instance = new Chalk({level: 3});
	instance.defineTheme('mytheme', {primary: chalk.green});
	instance.theme('mytheme');

	t.is(instance.theme().primary('x'), '\u{1B}[32mx\u{1B}[39m');
});

test('defineTheme is available on chalk builders', t => {
	chalk.defineTheme('builder-theme', {primary: chalk.magenta});

	chalk.theme('builder-theme');
	t.is(chalk.theme().primary('x'), '\u{1B}[35mx\u{1B}[39m');
});

test('a theme with a hex style applies truecolor when level is 3', t => {
	chalk.level = 3;
	chalk.defineTheme('hex', {primary: chalk.hex('#FF0000')});
	chalk.theme('hex');

	t.is(chalk.theme().primary('x'), '\u{1B}[38;2;255;0;0mx\u{1B}[39m');
});

test('a theme respects its instance level of 0 by emitting no styling', t => {
	const instance = new Chalk({level: 0});
	// Build the style on the same instance so it reads the instance's own level.
	instance.defineTheme('mytheme', {primary: instance.blue});
	instance.theme('mytheme');
	t.is(instance.theme().primary('x'), 'x');
});

test('themes accept styles from any chalk instance', t => {
	const other = new Chalk({level: 3});
	other.defineTheme('from-other', {primary: other.cyan});
	other.theme('from-other');

	const target = new Chalk({level: 3});
	target.defineTheme('mine', {primary: other.theme().primary});
	target.theme('mine');

	t.is(target.theme().primary('x'), '\u{1B}[36mx\u{1B}[39m');
});

test('the theme accessor is frozen and cannot be mutated', t => {
	chalk.defineTheme('mytheme', {primary: chalk.blue});
	chalk.theme('mytheme');

	const accessor = chalk.theme();
	t.true(Object.isFrozen(accessor));
});

test('theme() on a chain returns the instance-level theme accessor', t => {
	chalk.defineTheme('mytheme', {primary: chalk.blue});
	chalk.theme('mytheme');

	const chained = chalk.bold.rgb(1, 2, 3);
	t.is(chained.theme().primary('x'), '\u{1B}[34mx\u{1B}[39m');
});
