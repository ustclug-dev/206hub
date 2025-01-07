{ pkgs ? import <nixpkgs> {} }:

with pkgs; mkShell {
    buildInputs = [
        python312
        nodejs-18_x
    ];
}
