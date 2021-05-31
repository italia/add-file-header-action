# Add file header GitHub Action

⚠️ This project is WIP ⚠️

[![Join the #publiccode channel](https://img.shields.io/badge/Slack%20channel-%23publiccode-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CAM3F785T)
[![Get invited](https://slack.developers.italia.it/badge.svg)](https://slack.developers.italia.it/)

GitHub Action to add header files programmatically.

## Inputs

The following inputs briefly explained here are fully declared and documented in the [action.yaml](action.yaml):

* `gitname` [**Optional**] - Git name configuration for bump commit if you use a Pull Request action (default `Add headers bot`)

* `gitmail` [**Optional**] - Git mail configuration for bump commit if you use a Pull Request action (default `''`)

### Configuration file

Example

```json
{ 
    "srcFolders": ["./"],
    "rules": [
        {
            "match": [".*\\.xml"],
            "skipIfContains": "license-start",
            "comments": {
                "start": "<!--",
                "line": "   ~ ",
                "end": "-->"
            },
            "content": "default_license_header.txt"
        }
    ]
}
```

## Examples

Include this action in your repo by creating 
`.github/workflows/js-action-template.yml`and edit where needed:

```yml
on: [push, pull_request]

jobs:
  examplejob:
    runs-on: ubuntu-latest
    name: Get Stars and License
    steps:
    - uses: actions/checkout@v2
    - uses: italia/add-file-header-action@v1
```

## Build the action

Install dependencies

```sh
npm i
```

Build the action

```sh
npm run build
```

## Contributing

Contributing is always appreciated.
Feel free to open issues, fork or submit a Pull Request.
If you want to know more about how to add new fields, check out [CONTRIBUTING.md](CONTRIBUTING.md).
In order to support other country-specific extensions in addition to Italy some
refactoring might be needed.

## Maintainers

This software is maintained by the
[Developers Italia](https://developers.italia.it/) team.

## License

© 2021 Dipartimento per la Trasformazione Digitale - Presidenza del Consiglio dei
Ministri

Licensed under the EUPL.
The version control system provides attribution for specific lines of code.

## Remarks

This GitHub Action is published in the Github Marketplace.
As such, you can find the [Terms of Service here](https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-marketplace-terms-of-service).
Also, [here](https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-marketplace-developer-agreement)
you can find the GitHub Marketplace Developer Agreement.
