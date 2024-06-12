---
title: Sponsors
---

### Why Sponsor?
The cybersecurity industry requires more skilled professionals to handle the increasing challenges faced by businesses, governments, and individuals. UC Santa Cruz has a group of enthusiastic students who are eager to improve their skills and contribute to the field. You can support these students by sponsoring Slug Security, which will help them learn and grow, ultimately strengthening the cybersecurity industry.

As a sponsor, you'll have the chance to invest in the future of cybersecurity and positively impact the students who will shape the industry.

**Slug Security is a 501(C)(3) nonprofit organization (EIN 94-1539563 "The Regents of the University of California").**

### Use of Resources
The support we receive from our sponsors, such as equipment, subscriptions, or funding, will be used to support a variety of activities, including:

- Hosting guest speakers from industry and academia
- Participating in cybersecurity competitions and hackathons
- Organizing workshops and training sessions
- Providing training materials and tools through subscription-based resources
- Purchasing equipment and materials for projects and activities

### What Do You Get?
By supporting Slug Security, sponsors will gain several benefits depending on the level of support, including:

- Access to a talented and motivated group of students
- Visibility and recognition through club events and activities, such as:
	- Logo placement on club materials (e.g., t-shirts, banners, etc.)
	- Representation at events and competitions, as well as on our website and social media
- Opportunities to recruit top talent for internships and full-time positions
- The satisfaction of supporting a valuable educational and professional development opportunity for students

If you are interested in supporting us, please contact us via [slugsec@ucsc.edu](mailto:slugsec@ucsc.edu).

***

### Current Sponsors
A big thanks to all our sponsors! Your support truly makes a difference and helps us create awesome experiences.

<div class="sponsor-container">
	{% for sponsor in sponsors %}
		<div class="sponsor-item">
			<a href="{{ sponsor.Link }}" title="{{ sponsor.Name }}">
				<img src="{{ sponsor.LogoPath }}" alt="{{ sponsor.Name }} Logo" loading="lazy">
			</a>
		</div>
	{% endfor %}
</div>