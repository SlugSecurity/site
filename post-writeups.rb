require 'fileutils'
require 'yaml'
require 'front_matter_parser'

ROOT_DIR = './writeups'
TARGET_DIR = './_writeups'
NAV_FILE = './_data/writeupNav.yml'

def move_and_update_index_file(index_file, new_file_path, event_key)
	puts "Moved and updated index file, now at #{new_file_path}"

	parsed = FrontMatterParser::Parser.parse_file(index_file)

	parsed.front_matter['aside'] = {} unless parsed.front_matter['aside']
	parsed.front_matter['aside']['toc'] = true unless parsed.front_matter['aside']['toc']

	parsed.front_matter['sidebar'] = {} unless parsed.front_matter['sidebar']
	parsed.front_matter['sidebar']['nav'] = event_key unless parsed.front_matter['sidebar']['nav']

	new_content = parsed.front_matter.to_yaml + "---\n" + parsed.content

	# Remove any leading "---"
	new_content.sub!(/^---\n/, '')

	# Ensure the YAML front matter is properly delimited
	new_content = "---\n" + new_content unless new_content.start_with?('---\n')

	File.open(new_file_path, 'w') { |f| f.write(new_content) }

	FileUtils.rm(index_file)
end

def process_event_dir(event_dir, year, nav_content)
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
			end
		elsif File.file?(subdir_or_file) && File.basename(subdir_or_file) != 'index.md'
			category = File.basename(subdir_or_file, '.md')

			# Add category to nav_content without children (challenges)
			category_entry = { 'title' => category, 'url' => "/Writeups/#{year}/#{event_title}/#{category}" }
			nav_content[event_key].push(category_entry)
			
			puts "Lone item found \"#{category}\" in event \"#{File.basename(event_dir)}\" (#{year})"
		end
	end

	# Moving and updating index files
	index_file = File.join(event_dir, 'index.md')
	new_file_path = File.join(TARGET_DIR, "#{year}-#{event_title}.md")

	move_and_update_index_file(index_file, new_file_path, event_key)
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

			process_event_dir(event_dir, year, nav_content)
		end
	end

	# Write nav_content to NAV_FILE
	File.open(NAV_FILE, 'w') do |file|
		file.write(nav_content.to_yaml)
	end
end
	
main()
