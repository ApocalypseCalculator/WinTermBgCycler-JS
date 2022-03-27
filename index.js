const fs = require('fs');
const path = require('path');
const config = require('./config');

var counter = 0;

setInterval(function() {
    let filename = apply();
    console.log((filename) ? `Applied background: ${filename}` : 'No images to apply');
    counter++;
}, config.interval);

function apply() {
    let rawSettings = fs.readFileSync(config.winterm.settings);
    let settings = JSON.parse(rawSettings);
    let bgs = loadImages();
    if(bgs.length != 0) {
        settings.profiles.list.forEach(e => {
            e.backgroundImage = bgs[counter % bgs.length];
        });
        fs.writeFileSync(config.winterm.settings, JSON.stringify(settings, null, 4));
        return path.basename(bgs[counter % bgs.length]);
    }
    else {
        return null;
    }
}

function loadImages() {
    let paths = [];
    fs.readdirSync('./backgrounds/').forEach(function (file) {
        if (file === config.picsfile) {
            fs.readFileSync(`./backgrounds/${file}`).toString().split('\n').map(e => {
                let val = e.trim();
                if (!val.startsWith('&') && validImage(val) && fs.existsSync(val)) {
                    paths.push(val);
                }
            });
        }
        else if (validImage(e)) {
            paths.push(path.join(__dirname, `./backgrounds/${file}`));
        }
    });
    return paths;
}

function validImage(image) {
    let img = image.toLowerCase().trim();
    return img.endsWith('.jpg') || img.endsWith('.jpeg') || img.endsWith('.png') || img.endsWith('.webp');
}
