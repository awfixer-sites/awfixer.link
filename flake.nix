{
  description = "AWFixer development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core dependencies
            nodejs_24
            nodePackages.pnpm

            # Development tools
            git
            jq
            gnumake

            # Additional helpful tools
            nodePackages.typescript-language-server
            nodePackages.vscode-langservers-extracted # HTML/CSS/JSON/ESLint language servers
          ];

          shellHook = ''
            # Welcome message
            echo "🚀 Welcome to the AWFixer development environment!"
            echo "📦 Node.js: $(node --version)"
            echo "📦 PNPM: $(pnpm --version)"
            echo ""
            echo "Available commands:"
            echo "- pnpm install         # Install dependencies"
            echo "- cd app && pnpm dev   # Start the frontend development server"
            echo ""
          '';

          # Environment variables
          env = {
            # Add any environment variables needed for development here
            NODE_OPTIONS = "--max-old-space-size=4096";
          };
        };
      });
}
