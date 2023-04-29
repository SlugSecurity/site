---
layout: article
aside:
  toc: true
title: Sponsors
show_title: false
---

### Why Sponsor?
The cybersecurity field is in need of more skilled professionals to tackle the ever-growing challenges faced by businesses, governments, and individuals alike. UC Santa Cruz has a dedicated group of students eager to develop their skills and contribute to the industry. By sponsoring Slug Security, you can help empower these students to learn and grow, ultimately strengthening the field of cybersecurity.

As a sponsor, you'll have the opportunity to invest in the future of cybersecurity and make a positive impact on the students who will shape the industry.

*Slug Security is a 501(c)(3) nonprofit organization.*

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

### Current Sponsors
<div class="sponsor-container">
	{% for sponsor in site.data.sponsors %}
		<div class="sponsor-item">
			<img src="{{ sponsor.LogoPath }}" alt="{{ sponsor.Name }} Logo" loading="lazy" href="{{ sponsor.Link }}" title="{{ sponsor.Name }}">
		</div>
	{% endfor %}
</div>