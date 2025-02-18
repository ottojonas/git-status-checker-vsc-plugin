import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // Create a test workspace
    const testWorkspace = path.join(
      os.tmpdir(),
      `test-workspace-${Math.random()}`
    );
    fs.mkdirSync(testWorkspace);

    // The folder containing the Extension Manifest package.json
    const extensionDirName = path.resolve(__dirname, "../../");

    // The path to the extension test script
    const testRunnerPath = path.resolve(__dirname, "./suite/index");

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath: extensionDirName,
      extensionTestsPath: testRunnerPath,
      launchArgs: [testWorkspace, "--disable-extensions"],
    });

    // Clean up
    fs.rmSync(testWorkspace, { recursive: true, force: true });
  } catch (err) {
    console.error("Failed to run tests", err);
    process.exit(1);
  }
}

main();
