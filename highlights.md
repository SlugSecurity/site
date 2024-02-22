---
layout: article
aside:
  toc: true
title: Highlights
show_title: false
---

### Highlights
Curious about what we've been up to? Here are some of our highlights that showcase our achievements and activities. For more information on how to get involved, please visit our [Frequently Asked Questions](/faq) page.

### 2024
<div class="highlight-container">
	{% for highlight in site.data.highlights['2024'] %}
		{% include highlight-card.html data=highlight %}
	{% endfor %}
</div>

### 2023
<div class="highlight-container">
	{% for highlight in site.data.highlights['2023'] %}
		{% include highlight-card.html data=highlight %}
	{% endfor %}
</div>

### 2022
<div class="highlight-container">
	{% for highlight in site.data.highlights['2022'] %}
		{% include highlight-card.html data=highlight %}
	{% endfor %}
</div>
