## Setting up your development environment

### 1. Install Ruby and other dependencies
```
$ sudo apt install ruby-full build-essential zlib1g-dev
```
For non Debian-based Linux distributions, see [here](https://jekyllrb.com/docs/installation/).

### 2. Install Bundler and Jekyll
```
$ sudo gem install bundler jekyll
```

### 3. Install project dependencies
```
$ bundle install --path vendor/bundle
```

### 4. Serve the website locally
```
$ bundle exec jekyll serve
```
It should be available at http://localhost:4000.
