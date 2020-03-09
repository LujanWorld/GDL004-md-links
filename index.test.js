const mdLinks = require('./index.js');

it('throws exception with non-existant folder', async () => {
  await expect(
    mdLinks('folder/doesn-texist', { validate: true })
  ).rejects.toThrow(
    "ENOENT: no such file or directory, lstat 'folder/doesn-texist'"
  );
});

it('returns empty array when path is empty folder', async () => {
  await expect(
    mdLinks('testdata/empty', { validate: true })
  ).resolves.toStrictEqual([]);
});

it('works with files', async () => {
  await expect(
    mdLinks('testdata/simple.md', { validate: true })
  ).resolves.toStrictEqual([
    {
      href: 'https://google.com',
      ok: true,
      path: 'testdata/simple.md',
      status: 200,
      text: 'Google'
    }
  ]);
});
