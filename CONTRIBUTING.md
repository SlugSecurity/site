## Setting up your development environment

### 1. Install Ruby and other dependencies
Start off by installing [rvm (ruby version manager)](https://rvm.io/). Verify ruby and gem are at the following versions or higher:
```
$ ruby -v
ruby 3.3.0 ...

$ gem -v
3.5.3
```

### 2. Install Bundler and Jekyll
```
$ sudo gem install bundler jekyll
```

### 3. Install project dependencies
```
$ bundle install
```

### 4. Serve the website locally
```
$ bundle exec jekyll serve
```
It should be available at http://localhost:4000.
