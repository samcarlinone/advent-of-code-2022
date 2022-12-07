const inputString = document.querySelector('pre').innerText.trim();

const parent = Symbol('parent');
const name = Symbol('name');
const size = Symbol('size');

const cdRootCommand = /^\$ cd \/$/;
const cdUpCommand = /^\$ cd \.\.$/;
const cdCommand = /^\$ cd (\w+)$/;
const lsCommand = /^\$ ls$/;

const dirListing = /^dir (\w+)$/;
const fileListing = /^(\d+) (.+)$/;

const buildFileSystem = (commandLogs) => {
  let root = {[name]: '/', [parent]: null, [size]: 0};
  let currendDirectory = root;

  commandLogs.split('\n').forEach(line => {
    if (lsCommand.test(line)) return;

    if (cdRootCommand.test(line)) {
      currendDirectory = root;
      return;
    }
  
    if (cdUpCommand.test(line)) {
      currendDirectory = currendDirectory[parent];
      return;
    }
  
    const cdParams = cdCommand.exec(line);
  
    if (cdParams) {
      const targetDirectory = {
        [parent]: currendDirectory,
        [name]: cdParams[1],
        [size]: 0,
      };

      currendDirectory[cdParams[1]] = targetDirectory;
      currendDirectory = targetDirectory;

      return;
    }

    if (dirListing.test(line)) return;

    const fileListingParams = fileListing.exec(line);

    if (fileListingParams) {
      const fileSize = Number(fileListingParams[1]);

      currendDirectory[fileListingParams[2]] = fileSize;

      let dir = currendDirectory;

      while (dir) {
        dir[size] += fileSize;

        dir = dir[parent];
      }

      return;
    }
  
    throw new Error(`Unrecognized line: ${line}`);
  });

  return root;
}

const fileSystem = buildFileSystem(inputString);

// Part 1
const findSmallDirectories = (dir, maxSize) => {
  const smallDirectories = Object.values(dir)
    .filter(entry => typeof entry === 'object')
    .map(subDir => findSmallDirectories(subDir, maxSize))
    .flat(1);

  if (dir[size] <= maxSize) {
    return [dir, ...smallDirectories];
  } else {
    return smallDirectories;
  }
}

const smallDirectories = findSmallDirectories(fileSystem, 100_000);

console.log('Small directory size sum: ', smallDirectories.reduce((t, dir) => t + dir[size], 0));

// Part 2
const findSmallestDirectoryLargerThan = (dir, minSize) => {
  if (dir[size] < minSize) return null;

  // We return this or the smallest subdir
  return Object.values(dir)
    .filter(entry => typeof entry === 'object')
    .map(subDir => findSmallestDirectoryLargerThan(subDir, minSize))
    .filter(subDir => subDir)
    .reduce((smallestDir, subDir) => subDir[size] < smallestDir[size] ? subDir : smallestDir, dir);
}

const findDirectoryToDelete = (dir, maxSize) => {
  const minToDelete = dir[size] - maxSize;

  if (minToDelete <= 0) return null;

  return findSmallestDirectoryLargerThan(dir, minToDelete);
}

const directoryToDelete = findDirectoryToDelete(fileSystem, 40_000_000);

console.log('Smallest directory to delete size: ', directoryToDelete[size]);
