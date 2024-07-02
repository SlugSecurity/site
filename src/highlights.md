---
title: Highlights
hide:
  - navigation
---

Curious about what we've been up to? Here are some of our highlights that showcase our achievements and activities. Wanna learn more about us? Check out our [Frequently Asked Questions](/about/faqs) or learn how you can [join Slug Security](/join)!

{% macro render_highlight_card(highlight) %}
<div class="highlight-card">
	<div class="card-top">
		<div class="placement-icon">
			{% if highlight.Placement == 1 %}
				<span class="twemoji first-place">{% include "_assets/icons/trophy.svg" %}</span>
			{% elif highlight.Placement == 2 %}
				<span class="twemoji second-place">{% include "_assets/icons/trophy.svg" %}</span>
			{% elif highlight.Placement == 3 %}
				<span class="twemoji third-place">{% include "_assets/icons/trophy.svg" %}</span>
			{% else %}
				<span class="twemoji other-place">{% include "_assets/icons/certificate.svg" %}</span>
			{% endif %}
		</div>

		<div class="highlight-info">
			<p class="highlight-type">{{ highlight.Type }}</p>
			<p class="highlight-name">{{ highlight.Name }}</p>
			<p class="highlight-date"><span class="twemoji">{% include "_assets/icons/calendar.svg" %}</span> {{ highlight.Date }}</p>
			<p class="highlight-location"><span class="twemoji">{% include "_assets/icons/map-marker.svg" %}</span> {{ highlight.Location }}</p>
			<p class="highlight-ranking"><span class="twemoji">{% include "_assets/icons/user-group.svg" %}</span> {{ highlight.Placement }} of {{ highlight.Participants }}</p>
		</div>
	</div>
	<div class="highlight-details">
		<a href="{{ highlight.Article | default('#') }}" class="highlight-link{% if not highlight.Article %} no-link{% endif %}">Article</a>
		&mdash;
		<a href="{{ highlight.Writeup | default('#') }}" class="highlight-link{% if not highlight.Writeup %} no-link{% endif %}">Writeup</a>
	</div>
</div>
{% endmacro %}

## 2024
<div class="highlight-container">
	{% for highlight in highlights['2024'] %}
		{{ render_highlight_card(highlight) }}
	{% endfor %}
</div>

## 2023
<div class="highlight-container">
	{% for highlight in highlights['2023'] %}
		{{ render_highlight_card(highlight) }}
	{% endfor %}
</div>

## 2022
<div class="highlight-container">
	{% for highlight in highlights['2022'] %}
		{{ render_highlight_card(highlight) }}
	{% endfor %}
</div>

## 2021
<div class="highlight-container">
	{% for highlight in highlights['2021'] %}
		{{ render_highlight_card(highlight) }}
	{% endfor %}
</div>
