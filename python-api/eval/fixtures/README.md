# Eval Fixtures

Place miniature/inspiration images in this directory alongside `labels.json`.

## labels.json format

```json
[
  {
    "image": "ultramarine_intercessor.jpg",
    "mode": "miniature",
    "source": "goonhammer | own_photo",
    "lighting": "studio | desk_lamp | daylight | flash",
    "expected_colours": [
      {
        "family": "blue",
        "acceptable_paints": ["Macragge Blue", "Ultramarines Blue", "Kantor Blue"],
        "metallic": false
      },
      {
        "family": "gold",
        "acceptable_paints": ["Retributor Armour", "Greedy Gold"],
        "metallic": true
      }
    ]
  }
]
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `image` | Yes | Filename relative to this directory |
| `mode` | Yes | `"miniature"` or `"inspiration"` |
| `source` | No | Where the image came from |
| `lighting` | No | Lighting conditions: `studio`, `desk_lamp`, `daylight`, `flash` |
| `expected_colours[].family` | Yes | Lowercase colour family, e.g. `"blue"`, `"red"`, `"gold"` |
| `expected_colours[].acceptable_paints` | Yes | Paint names that count as a correct match |
| `expected_colours[].metallic` | No | `true` if this colour should be detected as metallic |

## Running

```bash
cd python-api
python eval/run_eval.py
# or point to a custom labels file:
python eval/run_eval.py --fixtures path/to/labels.json
```

Results are written to `eval/results/<timestamp>.md`.
