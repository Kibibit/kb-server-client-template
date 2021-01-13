/* eslint-disable @typescript-eslint/no-var-requires */
const replace = require('replace-in-file');

const projectNameArgs = process.argv.slice(2);
const projectName = projectNameArgs[projectNameArgs.length - 1];

if (!projectName) {
  throw new Error('must pass a project name');
} else {
  console.log(projectName);
  // return;
}

const readmeFile = {
  files: './README.md',
  from: /<kb-server-client-template>/g,
  to: projectName,
};

(async () => {
  try {
    const results = await replace(readmeFile)
    console.log('Replacement results:', results);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
})();
