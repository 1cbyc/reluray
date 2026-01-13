import sys
import os

# Add parent directory to path so we can import ml module
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from ml.src.model_training import build_model, train_model
from ml.src.model_evaluation import plot_metrics, evaluate_model

# first name paths to data dir (using absolute paths)
import os
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
train_data_dir = os.path.join(base_dir, 'data', 'train')
val_data_dir = os.path.join(base_dir, 'data', 'val')
test_data_dir = os.path.join(base_dir, 'data', 'test')

# then building the model
model = build_model()

# then to train the model now
history = train_model(model, train_data_dir, val_data_dir, batch_size=32, epochs=10)

# now time to plot training metrics
plot_metrics(history)

# then i will evaluate the model
evaluate_model(model, test_data_dir)

# then save the trained model
model_path = os.path.join(base_dir, 'best_model.keras')
model.save(model_path)
print(f"✅ Saved your Model to: {model_path}")