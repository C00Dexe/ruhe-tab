"""Build a deterministic unsigned Firefox XPI with Python's standard library."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parent.parent
source = root / 'ruhe-tab-firefox'
manifest = json.loads((source / 'manifest.json').read_text(encoding='utf-8'))
names = ['manifest.json', 'index.html', 'style.css', 'app.mjs', 'model.mjs', 'storage.mjs', 'LICENSE.txt']
output = root / 'downloads' / f"ruhe-tab-firefox-{manifest['version']}.xpi"
output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name in names:
        entry = zipfile.ZipInfo(name, date_time=(2026, 10, 28, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        archive.writestr(entry, (source / name).read_bytes())
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert set(archive.namelist()) == set(names)
    assert json.loads(archive.read('manifest.json')) == manifest
    for name in names:
        assert archive.read(name) == (source / name).read_bytes()
print(output.name)
print('SHA256:', hashlib.sha256(output.read_bytes()).hexdigest())
