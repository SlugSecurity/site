require 'fileutils'
require 'safe_yaml'
require 'front_matter_parser'

ROOT_DIR = './writeups'
TARGET_DIR = './_writeups'
NAV_FILE = './_data/writeupNav.yml'

SafeYAML::OPTIONS[:default_mode] = :safe
SafeYAML::OPTIONS[:deserialize_symbols] = true
SafeYAML::OPTIONS[:allow_date] = true

def updateFrontMatter(file_path, event_key)
	file_content = File.read(file_path)

	# Extract the existing front matter from the file
	existing_front_matter = file_content[/---(.*?)---/m, 1]

	# If there's no front matter, we can't proceed
	if existing_front_matter.nil?
		raise "No front matter found in #{file_path}"
	end

	# Parse the existing front matter as YAML
	front_matter = YAML.load(existing_front_matter)

	front_matter['aside'] = {} unless front_matter['aside']
	front_matter['aside']['toc'] = true unless front_matter['aside'].key?('toc')

	if front_matter['sidebar'] && front_matter['sidebar'].key?('nav')
		front_matter['sidebar'].delete('nav')
	else
		front_matter['sidebar'] ||= {}
		front_matter['sidebar']['nav'] = event_key
	end

	new_front_matter = front_matter.to_yaml.strip
	new_file_content = file_content.sub(/---.*?---/m, new_front_matter + "\n---")

	File.open(file_path, 'w') { |f| f.write(new_file_content) }

	true
end

def createIndex(index_file, new_file_path, event_key)
	return unless updateFrontMatter(index_file, event_key)

	FileUtils.rm(index_file)
	puts "Moved and updated index file, now at #{new_file_path}"
end

def processEvent(event_dir, year, nav_content)
	event_title = File.basename(event_dir).gsub(' ', '-')
	event_key = "#{year}-#{event_title}"

	puts "\nEvent found \"#{File.basename(event_dir)}\" (#{year})"
	
	index_file = File.join(event_dir, 'index.md')
	unless File.exist?(index_file)
		puts "Index file not found, skipping..."
		return
	end

	# Add event to nav_content with "Home" entry
	nav_content[event_key] = [{ 'title' => 'Home', 'url' => '/' }]

	Dir.glob(File.join(event_dir, '*')) do |subdir_or_file|
		if File.directory?(subdir_or_file)
			category = File.basename(subdir_or_file)
			puts "Sub-Category found \"#{category}\""

			# Add category to nav_content with its children (challenges)
			category_entry = { 'title' => category, 'children' => [] }
			nav_content[event_key].push(category_entry)

			Dir.glob(File.join(subdir_or_file, '*.md')) do |challenge_file|
				challenge_title = File.basename(challenge_file, '.md')
				puts "Child found \"#{challenge_title}\""

				# Add challenge to category's children in nav_content
				challenge_entry = {
					'title' => challenge_title,
					'url' => "/Writeups/#{year}/#{event_title}/#{category}/#{challenge_title}"
				}
				category_entry['children'].push(challenge_entry)
				updateFrontMatter(challenge_file, event_key)
			end
		elsif File.file?(subdir_or_file) && File.basename(subdir_or_file) != 'index.md'
			category = File.basename(subdir_or_file, '.md')

			# Add category to nav_content without children (challenges)
			category_entry = { 'title' => category, 'url' => "/Writeups/#{year}/#{event_title}/#{category}" }
			nav_content[event_key].push(category_entry)
			updateFrontMatter(subdir_or_file, event_key)
			
			puts "Lone item found \"#{category}\" in event \"#{File.basename(event_dir)}\" (#{year})"
		end
	end

	# Moving and updating index files
	index_file = File.join(event_dir, 'index.md')
	new_file_path = File.join(TARGET_DIR, "#{year}-#{event_title}.md")

	createIndex(index_file, new_file_path, event_key)
end

def main()
	# clean up TARGET_DIR and NAV_FILE
	FileUtils.rm_rf(TARGET_DIR) if Dir.exist?(TARGET_DIR)
	FileUtils.rm(NAV_FILE) if File.exist?(NAV_FILE)

	Dir.mkdir(TARGET_DIR) unless Dir.exist?(TARGET_DIR)

	FileUtils.rm(File.join(ROOT_DIR, 'README.md')) if File.exist?(File.join(ROOT_DIR, 'README.md'))

	nav_content = {}

	Dir.glob(File.join(ROOT_DIR, '*')) do |year_dir|
		next unless File.directory?(year_dir)

		year = File.basename(year_dir)

		Dir.glob(File.join(year_dir, '*')) do |event_dir|
			next unless File.directory?(event_dir)

			processEvent(event_dir, year, nav_content)
		end
	end

	# Write nav_content to NAV_FILE
	File.open(NAV_FILE, 'w') do |file|
		file.write(nav_content.to_yaml)
	end
end
	
main()
