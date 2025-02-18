import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

export function activate(context: vscode.ExtensionContext) {
  // Register command for testing
  let disposable = vscode.commands.registerCommand(
    "git-changes-checker.checkForUnsyncedGitChanges",
    async () => {
      return await checkForUnsyncedGitChanges();
    }
  );

  context.subscriptions.push(disposable);

  // listen for shutdown
  vscode.workspace.onDidCloseTextDocument(async (document) => {
    const unsyncdChanges = await checkForUnsyncedGitChanges();

    if (unsyncdChanges) {
      vscode.window.showWarningMessage(
        "There are unsynced changes. Please push your changes before closing VSCode"
      );
    }
  });
}

async function checkForUnsyncedGitChanges(): Promise<boolean> {
  const execAsync = promisify(exec);

  try {
    // Get the workspace folder path
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return false;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;

    // Check for uncommitted changes
    const { stdout: statusOutput } = await execAsync("git status --porcelain", {
      cwd: workspacePath,
    });
    if (statusOutput.length > 0) {
      return true;
    }

    // Check for unpushed commits
    const { stdout: revListOutput } = await execAsync(
      "git rev-list HEAD --not --remotes",
      { cwd: workspacePath }
    );
    if (revListOutput.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking git status:", error);
    return false;
  }
}

export function deactivate() {}
