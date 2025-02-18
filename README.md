# Git Changes Checker for VSCode

A Visual Studio Code extension that helps prevent you from closing VSCode when you have unsynced Git changes.

## Features

- Automatically checks for uncommitted changes when closing files
- Detects unpushed commits
- Shows warning messages when unsynced changes are detected
- Works with any Git repository

## How It Works

The extension monitors your workspace for Git changes in two ways:

1. **Uncommitted Changes**: Checks if there are any modified, added, or deleted files that haven't been committed
2. **Unpushed Commits**: Detects if you have local commits that haven't been pushed to the remote repository

When you attempt to close a file with unsynced changes, the extension will display a warning message reminding you to push your changes.

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "Git Changes Checker"
4. Click Install

## Requirements

- Visual Studio Code version 1.67.0 or higher
- Git installed and accessible from command line
- An active Git repository in your workspace

## Usage

The extension works automatically in the background. No configuration is needed. When you close a file and have unsynced changes, you'll see a warning message.

You can also manually check for unsynced changes using the command:
