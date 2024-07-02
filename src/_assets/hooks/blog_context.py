'''
Adds posts and writeups to the context a page
'''

def on_page_context(context, page, config, nav):
	if not page.meta.get("blog_context"): return

	context["posts"] = config["plugins"]["material/blog"].blog.posts
	context["writeups"] = config["plugins"]["material/blog #2"].blog.posts
	return context