const srcFolders = ['app'];
const extensions = ['kt', 'xml'];

const comments = {
    xml: {
        preamble: '<!--',
        line: '   ~ ',
        end: '-->'
    },
    kt: {
        preamble: '/*',
        line: ' *  ',
        end: ' */'
    }
}

const fs = require("fs");
const path = require("path");
const readline = require('readline');


async function applyLicense(path, fileExtension) {
    const fileContent = fs.readFileSync(path, {encoding:'utf8', flag:'r'});

    if (fileContent.includes('license-start'))
        return

    let newFileHeader = comments[fileExtension].preamble + '\n';

    const licenseStream = fs.createReadStream('default_license_header.txt');

    const rl = readline.createInterface({
      input: licenseStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
        newFileHeader += `${comments[fileExtension].line}${line}\n`;
    }

    newFileHeader += `${comments[fileExtension].end}\n\n`
    fs.writeFileSync(path, `${newFileHeader}${fileContent}`, 'utf8')
}

async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

async function main() {
    for (const srcFolder of srcFolders) {
        for await (const path of walk(srcFolder)) {
            let fileExtension  = path.split('.').pop()
            if (extensions.includes(fileExtension)) {
                await applyLicense(path, fileExtension);
            }
        }
    }
}

main()