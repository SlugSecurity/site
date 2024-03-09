module Jekyll
	class RedirectionPage < Page
		def initialize(site, base, origin, redirect_to)
			@site = site
			@base = base
			@name = "#{origin}.html"

			self.process(@name)
			self.data = {
				'layout' => 'redir',
				'redirect_to' => redirect_to,
				'sitemap' => false
			}
		end
	end

	class RedirectionGenerator < Generator
		safe true
		priority :low

		def generate(site)
			if site.layouts.key? 'redirect'
				site.data['redirections'].each do |redirection|
					site.pages << RedirectionPage.new(site, site.source, redirection['origin'], redirection['destination'])
				end
			end
		end
	end
end
