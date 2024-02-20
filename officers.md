---
layout: article
aside:
  toc: true
title: Officers
show_title: false
---

### Interested In Joining?
Are you interested in helping make Slug Security better? Join our administrative team! We're always looking for new members to help us grow and improve. Keep an eye on our Discord server for announcements about officer applications—it's your opportunity to contribute! If you have any questions about how to apply or what being an officer involves, don't hesitate to reach out to us on Discord.

### Executive
<div class="officer-container">
	{% for officer in site.data.officers.Administration %}
		{% include officer-card.html Name=officer.Name Title=officer.Title Handle=officer.Handle Description=officer.Description Image=officer.Image Website=officer.Website LinkedIn=officer.LinkedIn GitHub=officer.GitHub Twitter=officer.Twitter %}
	{% endfor %}
</div>

### Operations
<div class="officer-container">
	{% for officer in site.data.officers.Operations %}
		{% include officer-card.html Name=officer.Name Title=officer.Title Handle=officer.Handle Description=officer.Description Image=officer.Image Website=officer.Website LinkedIn=officer.LinkedIn GitHub=officer.GitHub Twitter=officer.Twitter %}
	{% endfor %}
</div>

### Outreach & Finance
<div class="officer-container">
	{% for officer in site.data.officers['Outreach & Finance'] %}
		{% include officer-card.html Name=officer.Name Title=officer.Title Handle=officer.Handle Description=officer.Description Image=officer.Image Website=officer.Website LinkedIn=officer.LinkedIn GitHub=officer.GitHub Twitter=officer.Twitter %}
	{% endfor %}
</div>

### Alumni
<div class="officer-container">
	{% for officer in site.data.officers.Alumni %}
		{% include officer-card.html Name=officer.Name Title=officer.Title Handle=officer.Handle Description=officer.Description Image=officer.Image Website=officer.Website LinkedIn=officer.LinkedIn GitHub=officer.GitHub Twitter=officer.Twitter %}
	{% endfor %}
</div>