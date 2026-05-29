# Updating the upstream version

This package builds [Paperclip](https://github.com/paperclipai/paperclip) from source. The upstream repo is vendored as a git submodule at `./paperclip`, pinned to a release tag, and built with its own `Dockerfile` (see `images.paperclip.source.dockerBuild` in `startos/manifest/index.ts`).

## Determining the upstream version

Fetch the latest release tag:

```sh
gh release view -R paperclipai/paperclip --json tagName -q .tagName
```

The current pin is whatever commit the `./paperclip` submodule points at (`git submodule status`).

## Applying the bump

1. Move the submodule to the new release tag:

   ```sh
   cd paperclip
   git fetch --tags origin <new tag>      # e.g. v2026.525.0
   git checkout <new tag>
   cd ..
   git add paperclip
   ```

2. Update `startos/versions/current.ts`: set `version` to `<new tag without leading v>:0` (e.g. `2026.525.0:0`) and write the `releaseNotes`. Bump the `:N` revision instead of the upstream portion when the change is packaging-only.

3. Review the upstream changelog for new/removed environment variables or behavior changes that affect `startos/main.ts` (e.g. deployment-mode, hostname-trust, or auth env vars) and update accordingly.

4. Rebuild and verify: `make x86_64`.
