{
	description = "Slug Security site - Astro + React islands + Tailwind v4";

	inputs = {
		nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
		flake-utils.url = "github:numtide/flake-utils";
	};

	outputs = { self, nixpkgs, flake-utils }:
		flake-utils.lib.eachDefaultSystem (system:
			let
				pkgs = nixpkgs.legacyPackages.${system};
			in
			{
				devShells.default = pkgs.mkShell {
					buildInputs = with pkgs; [
						bun
						nodejs_22
						git
					];

					shellHook = ''
						if git submodule status | grep -q '^-'; then
							echo "initializing submodules..."
							[ -d src/posts ] && [ ! -f src/posts/.git ] && rm -rf src/posts
							git submodule update --init --recursive
						fi

						echo "Astro + React + Tailwind v4 dev environment"
						echo "run 'bun install' to install deps"
						echo "run 'bun run dev' to start dev server"
					'';
				};
			}
		);
}
