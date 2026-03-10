const fs = require('fs');
const file = 'd:/Transport_Website/src/components/Bus.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const bodyMaterial = (.*)/g, 'const BodyMaterial = () => $1');
content = content.replace(/const glassMaterial = (.*)/g, 'const GlassMaterial = () => $1');
content = content.replace(/const chromeMaterial = (.*)/g, 'const ChromeMaterial = () => $1');
content = content.replace(/const redHighlight = (.*)/g, 'const RedHighlight = () => $1');
content = content.replace(/const glowingRed = (.*)/g, 'const GlowingRed = () => $1');
content = content.replace(/const glowingWhite = (.*)/g, 'const GlowingWhite = () => $1');

content = content.replace(/\{bodyMaterial\}/g, '<BodyMaterial />');
content = content.replace(/\{glassMaterial\}/g, '<GlassMaterial />');
content = content.replace(/\{chromeMaterial\}/g, '<ChromeMaterial />');
content = content.replace(/\{redHighlight\}/g, '<RedHighlight />');
content = content.replace(/\{glowingRed\}/g, '<GlowingRed />');
content = content.replace(/\{glowingWhite\}/g, '<GlowingWhite />');

fs.writeFileSync(file, content, 'utf8');
console.log('Replacements done!');
