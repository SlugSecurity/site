Slug Security's site for writeups, announcements, projects, and miscellaneous information. Built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## Project setup
Create venv
```shell
python3 -m venv venv
```

Activate venv
```shell
source ./venv/bin/activate
```

Install python dependencies (requires insider access)
```shell
pip install -r requirements.txt git+https://${GH_TOKEN}@github.com/0xfbad/framework.git
```
And the image-processing dependencies
```shell
sudo apt install pngquant libcairo2-dev libfreetype6-dev libffi-dev libjpeg-dev libpng-dev libz-dev
```

## Development
Given the few submodules for posts and writeups, clone those
```
git submodule update --init --recursive
```
Since posts and writeups are submodules, in order to contribute to those sections, you will need to git push the changes from those directories - not the root directory here as this project auto pulls new submodule changes.

Serve site locally
```shell
python -m mkdocs serve
```

Site will be available at [localhost:8000](http://localhost:8000).

## Tips
Optimize PNG images
```shell
find ./src -type f -name "*.png" -exec pngquant --force --ext .png --skip-if-larger --strip -- "{}" \;
```
