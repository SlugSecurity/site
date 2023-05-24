require 'fileutils'

ROOT_DIR = './writeups'
TARGET_DIR = './_writeups'

Dir.mkdir(TARGET_DIR) unless Dir.exist?(TARGET_DIR)

FileUtils.rm(File.join(ROOT_DIR, 'README.md'))

Dir.glob(File.join(ROOT_DIR, '**', 'index.md')) do |index_file|
	event_title = File.basename(File.dirname(index_file)).gsub(' ', '-')
	year = File.basename(File.dirname(File.dirname(index_file)))
	new_file_path = File.join(TARGET_DIR, "#{year}-#{event_title}.md")

	puts "Moving #{index_file} to #{new_file_path}"

	FileUtils.mv(index_file, new_file_path)
end
