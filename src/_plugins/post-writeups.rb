require 'fileutils'
require 'safe_yaml'
require 'front_matter_parser'

ROOT_DIR = 'src/writeups'
TARGET_DIR = 'src/_writeups'

WRITEUP_ROOT = '_index.md'
REMOVE_FILES = ['README.md', 'CONTRIBUTING.md']

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

	# Root only front matter changes
	if file_path.include?(WRITEUP_ROOT)
		cover_image = "src/writeups/#{file_path.split('/')[2..-2].join('/')}/assets_/cover.jpg"
		raise "Cover image not found at #{event_key}, checked #{cover_image}" unless File.exist?(cover_image)
		front_matter['cover'] = cover_image
	end

	new_front_matter = front_matter.to_yaml.strip
	new_file_content = file_content.sub(/---.*?---/m, new_front_matter + "\n---")

	File.open(file_path, 'w') { |f| f.write(new_file_content) }

	true
end

def createIndex(index_file, new_file_path, event_key)
	return unless updateFrontMatter(index_file, event_key)

	FileUtils.mkdir_p(File.dirname(new_file_path))
	FileUtils.mv(index_file, new_file_path)
	puts "Moved and updated index file, now at #{new_file_path}"
end

def processEvent(event_dir, year)
	event_title = File.basename(event_dir).gsub(' ', '-')
	event_key = "#{year}-#{event_title}"

	puts "\nEvent found \"#{File.basename(event_dir)}\" (#{year})"
	
	index_file = File.join(event_dir, WRITEUP_ROOT)
	unless File.exist?(index_file)
		puts "Index file not found, skipping..."
		return
	end

	# Rename reserved folders from _name to name_
	Dir.glob(File.join(event_dir, '*')) do |subdir_or_file|
		if File.directory?(subdir_or_file)
			if File.basename(subdir_or_file).start_with?('_')
				new_name = File.join(File.dirname(subdir_or_file), File.basename(subdir_or_file)[1..-1] + '_')
				FileUtils.mv(subdir_or_file, new_name)
				puts "Renamed subdir \"#{subdir_or_file}\" to \"#{new_name}\""
			end
		end
	end

	# Moving and updating index files
	index_file = File.join(event_dir, WRITEUP_ROOT)
	parsed = FrontMatterParser::Parser.parse_file(index_file)
	front_matter = parsed.front_matter

	if front_matter['date']
		date = front_matter['date'].strftime("%Y-%m-%d")
		new_file_path = File.join(TARGET_DIR, "#{date}-#{event_title}.md")
	else
		raise "No date found in front matter of #{index_file}"
	end

	createIndex(index_file, new_file_path, event_key)
end


def main()
	FileUtils.rm_rf(TARGET_DIR) if Dir.exist?(TARGET_DIR)
	Dir.mkdir(TARGET_DIR) unless Dir.exist?(TARGET_DIR)

	REMOVE_FILES.each { |file| FileUtils.rm(File.join(ROOT_DIR, file)) if File.exist?(File.join(ROOT_DIR, file)) }

	Dir.glob(File.join(ROOT_DIR, '*')) do |year_dir|
		next unless File.directory?(year_dir)

		year = File.basename(year_dir)

		Dir.glob(File.join(year_dir, '*')) do |event_dir|
			next unless File.directory?(event_dir)

			processEvent(event_dir, year)
		end
	end
end
	
#main()
