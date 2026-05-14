"""
Active Learning Labelling UI
A Flask app for manually labelling colour samples
Prioritises uncertain predictions to maximise learning

Run with: python labeller/app.py
Then open: http://localhost:5001
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import json
from pathlib import Path
from typing import Dict, List
from datetime import datetime
import sys

sys.path.append(str(Path(__file__).parent.parent))
from config import PROCESSED_DIR, LABELLED_DIR, COLOUR_FAMILIES, RAW_DIR

app = Flask(__name__, template_folder='templates', static_folder='static')

# Paths
RESULTS_FILE = PROCESSED_DIR / "all_results.jsonl"
LABELS_FILE = LABELLED_DIR / "labels.jsonl"
LABELLED_DIR.mkdir(parents=True, exist_ok=True)


def load_labelled_ids() -> set:
    """Load IDs of already labelled samples"""
    labelled = set()
    if LABELS_FILE.exists():
        with open(LABELS_FILE) as f:
            for line in f:
                try:
                    record = json.loads(line)
                    labelled.add(record.get("sample_id"))
                except json.JSONDecodeError:
                    continue
    return labelled


def get_samples_to_label(limit: int = 50) -> List[Dict]:
    """
    Get samples that need labelling.
    Prioritises LOW confidence predictions (active learning!)
    """
    if not RESULTS_FILE.exists():
        return []

    labelled_ids = load_labelled_ids()
    candidates = []

    with open(RESULTS_FILE) as f:
        for line in f:
            try:
                record = json.loads(line)
                filename = record.get("filename", "")
                source_dir = record.get("source_dir", "unknown")

                if "api_result" not in record:
                    continue

                # API returns "colors" not "detectedColors"
                colours = record["api_result"].get("colors", [])

                for idx, colour in enumerate(colours):
                    sample_id = f"{filename}_{idx}"

                    if sample_id in labelled_ids:
                        continue

                    confidence = colour.get("confidence", 0.5)

                    candidates.append({
                        "sample_id": sample_id,
                        "filename": filename,
                        "source_dir": source_dir,
                        "colour_index": idx,
                        "colour": colour,
                        "confidence": confidence,
                        "source_metadata": record.get("source_metadata", {}),
                    })
            except json.JSONDecodeError:
                continue

    # Sort by confidence (low first = most uncertain = most valuable to label)
    candidates.sort(key=lambda x: x["confidence"])

    return candidates[:limit]


@app.route("/")
def index():
    """Main labelling page"""
    samples = get_samples_to_label(50)
    labelled_count = len(load_labelled_ids())

    # Count total samples available
    total_samples = 0
    if RESULTS_FILE.exists():
        with open(RESULTS_FILE) as f:
            for line in f:
                try:
                    record = json.loads(line)
                    if "api_result" in record:
                        total_samples += len(record["api_result"].get("colors", []))
                except:
                    continue

    return render_template("label.html",
        samples=samples,
        labelled_count=labelled_count,
        total_samples=total_samples,
        families=COLOUR_FAMILIES
    )


@app.route("/api/label", methods=["POST"])
def submit_label():
    """Submit a label for a sample"""
    data = request.json

    sample_id = data.get("sample_id")
    correct_family = data.get("correct_family")
    is_correct = data.get("is_correct", False)
    notes = data.get("notes", "")

    if not sample_id or (not is_correct and not correct_family):
        return jsonify({"error": "Missing required fields"}), 400

    # Save label
    label_record = {
        "sample_id": sample_id,
        "is_correct": is_correct,
        "predicted_family": data.get("predicted_family"),
        "correct_family": correct_family if not is_correct else data.get("predicted_family"),
        "notes": notes,
        "labelled_at": datetime.now().isoformat(),
    }

    with open(LABELS_FILE, "a") as f:
        f.write(json.dumps(label_record) + "\n")

    return jsonify({"success": True})


@app.route("/api/stats")
def get_stats():
    """Get labelling statistics"""
    labels = []
    if LABELS_FILE.exists():
        with open(LABELS_FILE) as f:
            for line in f:
                try:
                    labels.append(json.loads(line))
                except:
                    continue

    correct = sum(1 for l in labels if l.get("is_correct"))
    total = len(labels)

    family_counts = {}
    for label in labels:
        fam = label.get("correct_family", "Unknown")
        family_counts[fam] = family_counts.get(fam, 0) + 1

    return jsonify({
        "total_labelled": total,
        "correct_predictions": correct,
        "accuracy": correct / total if total > 0 else 0,
        "by_family": family_counts,
    })


@app.route("/images/<path:filepath>")
def serve_image(filepath):
    """Serve images from raw directories"""
    # Try each source directory
    for source in ['reddit', 'tutorials', 'pinterest']:
        image_path = RAW_DIR / source / filepath
        if image_path.exists():
            return send_from_directory(RAW_DIR / source, filepath)

    return "Image not found", 404


# Create template on startup
def create_template():
    """Create the HTML template file"""
    template_dir = Path(__file__).parent / "templates"
    template_dir.mkdir(exist_ok=True)
    template_file = template_dir / "label.html"

    template_content = '''<!DOCTYPE html>
<html>
<head>
    <title>SchemeStealer - Colour Labeller</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #1a1a2e;
            color: #ffd700;
        }
        h1 {
            color: #ffd700;
            text-align: center;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #888;
            margin-bottom: 30px;
        }
        .stats {
            background: linear-gradient(135deg, #16213e, #1a1a2e);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
            border: 1px solid #ffd700;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #ffd700;
        }
        .stat-label {
            color: #888;
            font-size: 14px;
        }
        .samples-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
        }
        .sample {
            background: linear-gradient(135deg, #0f3460, #16213e);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #333;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .sample:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .sample.labelled {
            opacity: 0.3;
            pointer-events: none;
        }
        .sample-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        .colour-swatch {
            width: 80px;
            height: 80px;
            border-radius: 12px;
            border: 3px solid #ffd700;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            flex-shrink: 0;
        }
        .sample-info {
            flex: 1;
            min-width: 0;
        }
        .hex-code {
            font-size: 20px;
            font-weight: bold;
            color: #fff;
            font-family: monospace;
        }
        .predicted {
            color: #4fc3f7;
            margin: 5px 0;
        }
        .confidence {
            font-size: 13px;
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        .confidence.low { background: #f44336; color: white; }
        .confidence.medium { background: #ff9800; color: white; }
        .confidence.high { background: #4caf50; color: white; }
        .source-info {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .actions {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: transform 0.1s, box-shadow 0.1s;
        }
        button:hover {
            transform: translateY(-1px);
        }
        button:active {
            transform: translateY(0);
        }
        .correct {
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
        }
        .wrong {
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
        }
        select {
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            border: 2px solid #333;
            background: #1a1a2e;
            color: #fff;
            flex: 1;
            min-width: 150px;
        }
        select:focus {
            border-color: #ffd700;
            outline: none;
        }
        .instructions {
            background: #16213e;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 4px solid #ffd700;
        }
        .instructions h3 {
            margin-top: 0;
            color: #ffd700;
        }
        .instructions ul {
            color: #ccc;
            margin-bottom: 0;
        }
        .instructions li {
            margin: 8px 0;
        }
        .no-samples {
            text-align: center;
            padding: 60px;
            color: #888;
            font-size: 18px;
        }
        @media (max-width: 600px) {
            .samples-grid {
                grid-template-columns: 1fr;
            }
            .sample-header {
                flex-direction: column;
                text-align: center;
            }
            .actions {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <h1>⚔️ SchemeStealer Colour Labeller</h1>
    <p class="subtitle">Active Learning - Label uncertain predictions to improve the model</p>

    <div class="stats">
        <div class="stat-item">
            <div class="stat-value">{{ labelled_count }}</div>
            <div class="stat-label">Samples Labelled</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{{ total_samples }}</div>
            <div class="stat-label">Total Samples</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{{ samples|length }}</div>
            <div class="stat-label">Pending Review</div>
        </div>
        <div class="stat-item">
            <a href="/api/stats" target="_blank" style="color: #4fc3f7;">📊 View Full Stats</a>
        </div>
    </div>

    <div class="instructions">
        <h3>📝 How to Label</h3>
        <ul>
            <li><strong>Green ✓ Correct:</strong> The predicted colour family is correct</li>
            <li><strong>Red ✗ Wrong:</strong> Select the correct family from the dropdown first, then click Wrong</li>
            <li><strong>Focus on LOW confidence samples</strong> - they provide the most learning value!</li>
            <li>Aim for 10-20 labels per session. Quality over quantity.</li>
        </ul>
    </div>

    {% if samples %}
    <div class="samples-grid">
        {% for sample in samples %}
        <div class="sample" id="sample-{{ sample.sample_id }}">
            <div class="sample-header">
                <div class="colour-swatch" style="background-color: {{ sample.colour.hex }}"></div>
                <div class="sample-info">
                    <div class="hex-code">{{ sample.colour.hex }}</div>
                    <div class="predicted">Predicted: <strong>{{ sample.colour.family or 'Unknown' }}</strong></div>
                    <span class="confidence {% if sample.confidence < 0.5 %}low{% elif sample.confidence < 0.75 %}medium{% else %}high{% endif %}">
                        {{ "%.0f"|format(sample.confidence * 100) }}% confidence
                    </span>
                    <div class="source-info">{{ sample.source_dir }}/{{ sample.filename }}</div>
                </div>
            </div>

            <div class="actions">
                <button class="correct" onclick="labelCorrect('{{ sample.sample_id }}', '{{ sample.colour.family or 'Unknown' }}')">
                    ✓ Correct
                </button>

                <select id="family-{{ sample.sample_id }}">
                    <option value="">Select correct family...</option>
                    {% for family in families %}
                    <option value="{{ family }}">{{ family }}</option>
                    {% endfor %}
                </select>

                <button class="wrong" onclick="labelWrong('{{ sample.sample_id }}', '{{ sample.colour.family or 'Unknown' }}')">
                    ✗ Wrong
                </button>
            </div>
        </div>
        {% endfor %}
    </div>
    {% else %}
    <div class="no-samples">
        <p>🎉 No samples to label!</p>
        <p>Run the batch processor to generate more samples:</p>
        <code>python processing/batch_processor.py</code>
    </div>
    {% endif %}

    <script>
        function labelCorrect(sampleId, predictedFamily) {
            fetch('/api/label', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sample_id: sampleId,
                    is_correct: true,
                    predicted_family: predictedFamily
                })
            }).then(response => {
                if (response.ok) {
                    const el = document.getElementById('sample-' + sampleId);
                    el.classList.add('labelled');
                    el.innerHTML = '<div style="text-align:center;padding:40px;color:#4caf50;">✓ Labelled as Correct</div>';
                }
            });
        }

        function labelWrong(sampleId, predictedFamily) {
            const select = document.getElementById('family-' + sampleId);
            const correctFamily = select.value;

            if (!correctFamily) {
                alert('Please select the correct colour family first');
                select.focus();
                return;
            }

            fetch('/api/label', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sample_id: sampleId,
                    is_correct: false,
                    predicted_family: predictedFamily,
                    correct_family: correctFamily
                })
            }).then(response => {
                if (response.ok) {
                    const el = document.getElementById('sample-' + sampleId);
                    el.classList.add('labelled');
                    el.innerHTML = '<div style="text-align:center;padding:40px;color:#f44336;">✗ Corrected to ' + correctFamily + '</div>';
                }
            });
        }
    </script>
</body>
</html>'''

    template_file.write_text(template_content, encoding='utf-8')
    print(f"  Template created at {template_file}")


if __name__ == "__main__":
    print("=" * 60)
    print("  SCHEMESTEALER - Active Learning Labeller")
    print("=" * 60)

    create_template()

    print("\n  Starting labeller UI...")
    print("  Open http://localhost:5001 in your browser")
    print("\n  Press Ctrl+C to stop\n")

    app.run(host='0.0.0.0', port=5001, debug=True)
