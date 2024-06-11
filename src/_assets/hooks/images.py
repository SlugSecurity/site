'''
Adds lazy loading to all images
Adds a data-description attribute to all images for lightbox (if the image has a title)
Wraps all images without an existing align attribute in a figure tag to center them
'''

import re

def on_page_markdown(markdown, **kwargs):
	def replace_image_tag(match):
		alt_text = match.group(1)
		image_url = match.group(2)
		title = match.group(4) if match.group(4) else ""
		existing_tags = match.group(5) if match.group(5) else ""
		new_tags = f'loading=lazy data-description="{title}"'

		if existing_tags:
			replacement = f'![{alt_text}]({image_url} "{title}"){existing_tags[:-1]} {new_tags} }}'
		else:
			replacement = f'![{alt_text}]({image_url} "{title}"){{ {new_tags} }}'

		return replacement

	def wrap_figure(match):
		image_tag = match.group(0)
		attributes = match.group(5) if match.group(5) else ""

		if 'align' in attributes:
			return image_tag

		wrapped_tag = f'<figure markdown="span">\n{image_tag}\n</figure>'
		return wrapped_tag
	
	image_pattern = re.compile(r'!\[(.*?)\]\((.*?)( "(.*?)")?\)\s*(\{.*?\})?')
	modified_markdown = re.sub(image_pattern, replace_image_tag, markdown)

	no_align_pattern = re.compile(r'!\[(.*?)\]\((.*?)( "(.*?)")?\)\s*(\{.*?\})?')
	modified_markdown = re.sub(no_align_pattern, wrap_figure, modified_markdown)

	return modified_markdown