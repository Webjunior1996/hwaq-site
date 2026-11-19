const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const codes = [
    'ro', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'su',
    'sw', 'sv', 'tg', 'ta', 'te', 'uk', 'ur', 'uz', 'cy', 'xh', 'yi', 'yo',
    'zu', 'fil'
];

const templatePath = path.join(dir, 'en.js');
const template = fs.readFileSync(templatePath, 'utf8');

for (const code of codes) {
    const targetPath = path.join(dir, `${code}.js`);
    if (fs.existsSync(targetPath)) {
        throw new Error(`File already exists: ${targetPath}`);
    }

    const content = template.replace(
        'window.hwaqLangFiles.en =',
        `window.hwaqLangFiles.${code} =`
    );

    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox, { filename: `${code}.js` });

    if (!sandbox.window.hwaqLangFiles || !sandbox.window.hwaqLangFiles[code]) {
        throw new Error(`Generated content is invalid for ${code}.js`);
    }

    fs.writeFileSync(targetPath, content, 'utf8');
}
