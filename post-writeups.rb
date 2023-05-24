require 'fileutils'
require 'yaml'

ROOT_DIR = './writeups'
TARGET_DIR = './_writeups'
NAV_FILE = './_data/navigation.yml'

Dir.mkdir(TARGET_DIR) unless Dir.exist?(TARGET_DIR)

FileUtils.rm(File.join(ROOT_DIR, 'README.md')) if File.exist?(File.join(ROOT_DIR, 'README.md'))

nav_content = YAML.load_file(NAV_FILE)

Dir.glob(File.join(ROOT_DIR, '*')) do |year_dir|
  next unless File.directory?(year_dir)

  year = File.basename(year_dir)

  Dir.glob(File.join(year_dir, '*')) do |event_dir|
    next unless File.directory?(event_dir)

    event_title = File.basename(event_dir).gsub(' ', '-')
    event_key = "#{year}-#{event_title}"

    # Add event to nav_content with "Home" entry
    nav_content[event_key] = [{ 'title' => 'Home', 'url' => '/' }]

    # Process subdirectories (categories) and their files (challenges)
    Dir.glob(File.join(event_dir, '*')) do |subdir_or_file|
      if File.directory?(subdir_or_file)
        category = File.basename(subdir_or_file)

        # Add category to nav_content with its children (challenges)
        category_entry = { 'title' => category, 'children' => [] }
        nav_content[event_key].push(category_entry)

        Dir.glob(File.join(subdir_or_file, '*.md')) do |challenge_file|
          challenge_title = File.basename(challenge_file, '.md')

          # Add challenge to category's children in nav_content
          challenge_entry = {
            'title' => challenge_title,
            'url' => "/Writeups/#{year}/#{event_title}/#{category}/#{challenge_title}"
          }
          category_entry['children'].push(challenge_entry)
        end
      elsif File.file?(subdir_or_file) && File.basename(subdir_or_file) != 'index.md'
        category = File.basename(subdir_or_file, '.md')

        # Add category to nav_content without children (challenges)
        category_entry = { 'title' => category, 'url' => "/Writeups/#{year}/#{event_title}/#{category}" }
        nav_content[event_key].push(category_entry)
      end
    end

    # Moving index files
    index_file = File.join(event_dir, 'index.md')
    new_file_path = File.join(TARGET_DIR, "#{year}-#{event_title}.md")

    puts "Moving #{index_file} to #{new_file_path}"

    FileUtils.mv(index_file, new_file_path)
  end
end

# Write nav_content to NAV_FILE
File.open(NAV_FILE, 'w') do |file|
  file.write(nav_content.to_yaml.gsub("---", '## Dynamic Navigation ##'))
end
