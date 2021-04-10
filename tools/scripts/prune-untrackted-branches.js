const simpleGit = require('simple-git/promise');
const { chain, trim, map } = require('lodash');
const inquirer = require('inquirer');
const Table = require('cli-table');

const remoteInfoRegex = /^\[(.*?)\]\s/g;

const chars = {
  'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
  , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
  , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
  , 'right': '║', 'right-mid': '╢', 'middle': '│'
};

(async () => {
  const git = simpleGit();
  await git.fetch(['-p']); // prune? is it necassery?
  const branchSummaryResult = await git.branch(['-vv']);
  const localBranches = branchSummaryResult.branches;
  const localBranchesWithGoneRemotes = chain(localBranches)
    .filter((item) => !['master', 'next'].includes(item.name))
    .forEach((item) => {
      // console.log('an item appeared!', item);
      const remoteInfo = item.label.match(remoteInfoRegex);

      if (remoteInfo) {
        const parsedRemoteInfo = trim(remoteInfo[0], '[] ');
        const isMerged = parsedRemoteInfo.endsWith(': gone');
        const remoteBranchName = parsedRemoteInfo.replace(': gone', '');

        item.isMerged = isMerged;
        item.remoteName = remoteBranchName;
      }
    })
    .filter((item) => item.isMerged)
    .value();
    const branchNames = chain(localBranchesWithGoneRemotes).map('name').value();

  // interaction!
  const table = new Table({
    head: ['Branch Name', 'Origin Branch Name', 'Origin Branch Status'],
    chars
  });

  localBranchesWithGoneRemotes.forEach((item) => table.push([item.name, item.remoteName, 'GONE']));

  console.log(table.toString());

  const ACTION_ANSWERS = {
    PRUNE_ALL: 'prune all gone branches',
    SELECT_BRANCHES: 'Selected Individual branches to delete'
  }

  const answers = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'whatToDo',
        message: 'These branches have been deleted from the origin. What do you want to do with them?',
        choices: chain(ACTION_ANSWERS).values().value()
      }
    ]);

  if (answers.whatToDo === ACTION_ANSWERS.PRUNE_ALL) { 
    console.log(branchNames);
    await git.deleteLocalBranches(branchNames);
    console.log('DONE');
    return;
  }

  if (answers.whatToDo === ACTION_ANSWERS.SELECT_BRANCHES) {
    const answers = await inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'These branches have been deleted from the origin. Do you want to prune them?',
          name: 'pruneBranches',
          choices: branchNames
        }
      ]);

    await Promise.all(answers.pruneBranches.map((branchName) => git.deleteLocalBranch(branchName)));
    console.log('DONE');
    return;
  }
})();