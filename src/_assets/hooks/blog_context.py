'''
Adds posts and writeups data for anypage with "blog_content" in the front matter
For example, its used on the homepage to source the two columns showing the most recent posts and writeups
'''

def on_page_context(context, page, config, nav):
	if not page.meta.get("blog_context"):
		return

	context["posts"] = config["plugins"]["material/blog"].blog.posts
	context["writeups"] = config["plugins"]["material/blog #2"].blog.posts
	return context
