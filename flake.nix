{
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
					packages = with pkgs; [
						python3
						python3Packages.pip
						python3Packages.virtualenv
						pngquant
						libjpeg
						zlib
						freetype
						git
					];

					shellHook = ''
						if git submodule status | grep -q '^-'; then
							echo "initializing submodules..."
							[ -d src/posts ] && [ ! -f src/posts/.git ] && rm -rf src/posts
							[ -d src/writeups ] && [ ! -f src/writeups/.git ] && rm -rf src/writeups
							git submodule update --init --recursive
						fi

						if [ ! -d .venv ]; then
							echo "creating virtual environment..."
							python -m venv .venv
						fi
						source .venv/bin/activate

						if [ ! -f .venv/.deps_installed ]; then
							echo "installing python dependencies..."
							if [ -z "$GH_TOKEN" ]; then
								echo "warning: GH_TOKEN not set, private framework dependency may fail"
							fi
							pip install -r requirements.txt
							touch .venv/.deps_installed
						fi

						echo "mkdocs development environment ready"
						echo "run 'mkdocs serve' to start the dev server"
					'';
				};
			}
		);
}
