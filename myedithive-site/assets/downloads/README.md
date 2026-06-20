# Edithive beta downloads

Drop builds here. The /downloads page auto-detects which files exist by
sending a HEAD request to each expected filename below — if the file is
present, the tile becomes a working "Download" button. If not, it shows
"Coming soon" without breaking the page.

If a filename changes, update the matching entry in downloads.html.

## Expected filenames

| Product               | macOS (Apple Silicon)               | macOS (Intel)                       | Windows                          |
|-----------------------|-------------------------------------|-------------------------------------|----------------------------------|
| Edithive Select app   | edithive-select-mac-apple-silicon.pkg | edithive-select-mac-intel.pkg     | edithive-select-windows.exe      |
| Premiere Pro panel    | edithive-premiere-panel-mac.pkg     | edithive-premiere-panel-mac.pkg     | edithive-premiere-panel-win.zip  |
| DaVinci Resolve panel | edithive-resolve-panel-mac.pkg      | edithive-resolve-panel-mac.pkg      | edithive-resolve-panel-win.zip   |

Files in this folder are served with a 1-hour revalidate cache so a fresh
upload appears within an hour (or instantly with a hard refresh).
