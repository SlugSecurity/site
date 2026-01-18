---
title: Sponsors
glightbox: false
---

## Why Sponsor?

Slug Security is the largest cybersecurity organization at UC Santa Cruz and one of the largest student orgs on campus. We run technical workshops, compete in national competitions like CCDC and MITRE eCTF, and give students hands-on experience with real security work.

Sponsorships help us cover competition travel, equipment, infrastructure, and club events. Your support directly empowers students building careers in a field with growing demand.

**Slug Security is a 501(c)(3) nonprofit organization (under EIN 94-1539563 "The Regents of the University of California").**

## What Do You Get?

If you support us, you generally get:

- Visibility at club events, workshops, and on our website
- Access to students actively building careers in security
- Opportunities to recruit directly from our membership

We mainly run on alumni donations and university grants, so we don't have formal sponsorship brochures. But if you're interested, we're happy to work something out. Reach out at [slugsec@ucsc.edu](mailto:slugsec@ucsc.edu).

***

## Current Sponsors

Thank you to all of our sponsors for your support.

<div class="sponsor-container">
	{% for sponsor in sponsors %}
		<div class="sponsor-item">
			<a href="{{ sponsor.Link }}" title="{{ sponsor.Name }}">
				<img src="{{ sponsor.LogoPath }}" alt="{{ sponsor.Name }} Logo" loading="lazy">
			</a>
		</div>
	{% endfor %}
</div>
