# Locale manager action

An action to automatically synchronize locale files from an external repository into your project, based on my public locale manager [repository template](https://github.com/Maximus7474/locales-manager-template).
It's a good way to keep a closed-source project updated with a public, crowd-sourced translations repository.

### Inputs

| Input             | Description                                                               | Required | Default                               |
| ----------------- | ------------------------------------------------------------------------- | -------- | ------------------------------------- |
| `locale-repo`     | The full name of the locale repository (e.g., `Maximus7474/mps-locales`). | `true`   | `N/A`                                 |
| `resource-name`   | The name of the resource to be synced. Defaults to the repository name.   | `true`   | `repository name`                     |
| `locale-directory`| The relative path to the directory where locale files will be stored.     | `false`  | `./locales`                           |

### Example Workflow

Create a workflow file in your repository at `.github/workflows/update-locales.yml`. This example runs the action on every push to the `main` branch.

```yaml
name: Update Locales

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  sync-locales:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # fetches the new files from the locale-repo (has to be public)
      - name: Update locale files
        uses: Maximus7474/locale-manager-action@v1.0.0
        with:
          resource-name: 'mps-fleecanow'
          locale-repo: 'Maximus7474/mps-locales'
          locale-directory: './locales'

      # an ugly step to check if any changes occured to the locale directory
      # this is an example, you can rename directories
      - name: Check if locales were updated
        id: git-check
        run: |
          # Check for changes only in the locales directory
          git_status=$(git status --porcelain ./locales)
          echo "changes<<EOF" >> $GITHUB_OUTPUT
          echo "$git_status" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      # (optionnal) update your repository with the new changes
      # it is neater so do it and don't consider it as optional
      - name: Commit and Push if changes were made to locales
        if: steps.git-check.outputs.changes != ''
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add .
          git commit -am 'chore(locales): updated for ${{ github.ref_name }}'
          git push
```
