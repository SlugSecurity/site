# Slug Security Website

## Setup

```bash
nix develop
```

Manual submodule pull:
```bash
git submodule update --init --recursive
```

## Development

```bash
mkdocs serve
mkdocs build
```

## PNG Optimization

```bash
find ./src -type f -name "*.png" -exec pngquant --force --ext .png --skip-if-larger --strip {} +
```

## Requirements

Set `GH_TOKEN` for private framework dependency
