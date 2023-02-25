---
layout: article
aside:
  toc: true
title: Sponsors
show_title: false
---

### Why Sponsor?
UC Santa Cruz is home to a vibrant community of students with a passion for cyber security. The UCSC Security Club provides students with the opportunity to learn about the latest developments in the field, as well as hands-on experience through real-world projects and competitions.

By supporting the UCSC Security Club, sponsors have the opportunity to invest in the future of cybersecurity and make a positive impact on the students who will shape the industry.

### Use of Resources
The funds provided by our sponsors will be used to support a variety of activities, including:

- Hosting guest speakers from industry and academia
- Organizing workshops and training sessions
- Participating in cyber security competitions and hackathons
- Travel and lodging for club members to attend conferences and events
- Purchasing equipment and materials for club projects and activities

### What Do You Get?
By supporting the UCSC Security Club, sponsors will gain a number of benefits, including:

- Access to a talented and motivated group of students with a passion for cybersecurity
- Opportunities to connect with other industry leaders and experts in the field
- Visibility and recognition through club events and activities, such as
	- Logo placement on club materials (e.g. t-shirts, banners, etc.)
	- Representation at events and competitions, as well as on our website and social media
- Opportunities to recruit top talent for internships and full-time positions
- The satisfaction of supporting a valuable educational and professional development opportunity for students

If you are interested in supporting the UCSC Cybersecurity Club, please contact us via [slugsec@ucsc.edu](mailto:slugsec@ucsc.edu).

### Current Sponsors
<div class="sponsor-container">
	{% for sponsor in site.data.sponsors %}
		<div class="sponsor-item">
			<img src="{{ sponsor.LogoPath }}" alt="{{ sponsor.Name }} Logo" loading="lazy" href="{{ sponsor.Link }}" title="{{ sponsor.Name }}">
		</div>
	{% endfor %}
</div>