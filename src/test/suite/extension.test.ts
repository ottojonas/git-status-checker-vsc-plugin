import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

suite("Extension Test Suite", () => {
  const workspaceRoot = vscode.workspace.workspaceFolders![0].uri.fsPath;

  test("Check for unsynced changes in clean directory", async () => {
    const unsyncdChanges = await vscode.commands.executeCommand(
      "git-changes-checker.checkForUnsyncedGitChanges"
    );
    assert.strictEqual(unsyncdChanges, false);
  });

  test("Should handle non-git directory gracefully", async () => {
    // Create a temporary directory within our test workspace
    const tempDir = path.join(workspaceRoot, "temp-no-git");
    fs.mkdirSync(tempDir);

    const unsyncdChanges = await vscode.commands.executeCommand(
      "git-changes-checker.checkForUnsyncedGitChanges"
    );
    assert.strictEqual(unsyncdChanges, false);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("Should detect uncommitted changes", async () => {
    // Initialize git repository properly
    const gitDir = path.join(workspaceRoot, ".git");
    fs.mkdirSync(gitDir);

    // Create basic git structure
    fs.mkdirSync(path.join(gitDir, "objects"));
    fs.mkdirSync(path.join(gitDir, "refs"));
    fs.mkdirSync(path.join(gitDir, "refs/heads"));

    // Write minimal git config
    fs.writeFileSync(
      path.join(gitDir, "config"),
      "[core]\n\trepositoryformatversion = 0\n\tfilemode = false\n\tbare = false\n\tlogallrefupdates = true\n"
    );

    // Create HEAD file pointing to master branch
    fs.writeFileSync(path.join(gitDir, "HEAD"), "ref: refs/heads/master\n");

    // Create a test file
    const testFilePath = path.join(workspaceRoot, "test.txt");
    fs.writeFileSync(testFilePath, "test content");

    const unsyncdChanges = await vscode.commands.executeCommand(
      "git-changes-checker.checkForUnsyncedGitChanges"
    );
    assert.strictEqual(unsyncdChanges, true);

    // Cleanup
    fs.unlinkSync(testFilePath);
    fs.rmSync(gitDir, { recursive: true, force: true });
  });
});
