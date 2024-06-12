---
title: Officers
glightbox: false
---

Want to know the people making it all happen at Slug Security? See our current officers who help run the club operations, infrastructure, and outreach. Need to contact us? Email us at [slugsec@ucsc.edu](mailto:slugsec@ucsc.edu).

{% macro render_officer_card(officer) %}
<div class="officer-card">
    <div class="card-top">
        <img src="{{ officer.Image }}" alt="Profile Picture" class="officer-image">
        <div class="officer-content">
            <div class="officer-info">
                <p class="officer-title">{{ officer.Title }}</p>
                <p class="officer-name">{{ officer.Name }}</p>
                <p class="officer-handle">@{{ officer.Handle }}</p>
            </div>

            <div class="social-links">
                {% if officer.Website %}
                    <a href="{{ officer.Website }}" class="icon website-button" itemprop="sameAs" rel="noopener noreferrer" target="_blank">
                        <span class="twemoji">{% include "_assets/icons/globe.svg" %}</span>
                    </a>
                {% endif %}
                {% if officer.LinkedIn %}
                    <a href="https://www.linkedin.com/in/{{ officer.LinkedIn }}" class="icon linkedin-button" itemprop="sameAs" rel="noopener noreferrer" target="_blank">
                        <span class="twemoji">{% include "_assets/icons/linkedin-in.svg" %}</span>
                    </a>
                {% endif %}
                {% if officer.GitHub %}
                    <a href="https://github.com/{{ officer.GitHub }}" class="icon github-button" itemprop="sameAs" rel="noopener noreferrer" target="_blank">
                        <span class="twemoji">{% include "_assets/icons/github.svg" %}</span>
                    </a>
                {% endif %}
                {% if officer.Twitter %}
                    <a href="https://twitter.com/{{ officer.Twitter }}" class="icon twitter-button" itemprop="sameAs" rel="noopener noreferrer" target="_blank">
                        <span class="twemoji">{% include "_assets/icons/x-twitter.svg" %}</span>
                    </a>
                {% endif %}
            </div>
        </div>
    </div>

    <p class="officer-description">{{ officer.Description }}</p>
</div>
{% endmacro %}

### Executive
<div class="officer-container">
    {% for officer in officers.Administration %}
        {{ render_officer_card(officer) }}
    {% endfor %}
</div>

### Operations
<div class="officer-container">
    {% for officer in officers.Operations %}
        {{ render_officer_card(officer) }}
    {% endfor %}
</div>

### Outreach & Finance
<div class="officer-container">
    {% for officer in officers['Outreach & Finance'] %}
        {{ render_officer_card(officer) }}
    {% endfor %}
</div>

### Alumni
<div class="officer-container">
    {% for officer in officers.Alumni %}
        {{ render_officer_card(officer) }}
    {% endfor %}
</div>
