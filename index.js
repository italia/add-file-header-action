const core = require("@actions/core")
const fs = require("fs");
const path = require("path");
const readline = require('readline');
const simpleGit = require('simple-git');


const jsonConfig = JSON.parse(fs.readFileSync("./.header-config.json"))

async function applyHeader(path, rule) {
    const fileContent = fs.readFileSync(path, {encoding:'utf8', flag:'r'});

    if (fileContent.match(new RegExp(rule.skipIfContains, 'gm')))
        return

    let newFileHeader = (rule.comments.start || '') + '\n';

    const licenseStream = fs.createReadStream(rule.content);

    const rl = readline.createInterface({
        input: licenseStream,
        crlfDelay: Infinity
    });
  
    for await (const line of rl) {
        newFileHeader += `${rule.comments.line || ''}${line}\n`;
    }

    newFileHeader += `${rule.comments.end || ''}\n\n`
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
    try {
        const currentRepoGit = simpleGit();
        for (const srcFolder of jsonConfig.srcFolders) {
            for await (const path of walk(srcFolder)) {
                for (let rule of jsonConfig.rules) {
                    for (let match of rule.match) {
                        if (path.match(new RegExp(match, 'g'))) {
                            await applyHeader(path, rule);
                        }
                    }
                }
            }
        }
        currentRepoGit.addConfig('user.name', core.getInput('gitname')) 
        currentRepoGit.addConfig('user.email', core.getInput('gitmail'))
        currentRepoGit.add('.').commit(`chore: add missing headers to files`)
    } catch (error) {
        core.setFailed(error)
    }
}

main()