"""
Improved Training Script for ReluRay
Trains model with 36K images using enhanced architecture and best practices
"""

import sys
import os

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from ml.src.model_training_improved import (
    build_improved_model,
    create_data_generators,
    calculate_class_weights,
    train_improved_model
)
from ml.src.model_evaluation import plot_metrics, evaluate_model
import numpy as np

# Set up paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
train_data_dir = os.path.join(base_dir, 'data', 'train')
val_data_dir = os.path.join(base_dir, 'data', 'val')
test_data_dir = os.path.join(base_dir, 'data', 'test')

# Output paths
model_save_path = os.path.join(base_dir, 'best_model_improved.keras')
logs_dir = os.path.join(base_dir, 'ml', 'logs')

print("=" * 70)
print("🔬 ReluRay Improved Model Training")
print("=" * 70)
print(f"\n📁 Data directories:")
print(f"   Train: {train_data_dir}")
print(f"   Val: {val_data_dir}")
print(f"   Test: {test_data_dir}")
print(f"\n💾 Model will be saved to: {model_save_path}")
print(f"📊 Logs will be saved to: {logs_dir}")

# Check data availability
for split_name, split_dir in [('Train', train_data_dir), 
                              ('Val', val_data_dir), 
                              ('Test', test_data_dir)]:
    if os.path.exists(split_dir):
        normal_count = len([f for f in os.listdir(os.path.join(split_dir, 'NORMAL')) 
                           if f.endswith('.jpeg')]) if os.path.exists(os.path.join(split_dir, 'NORMAL')) else 0
        pneumonia_count = len([f for f in os.listdir(os.path.join(split_dir, 'PNEUMONIA')) 
                              if f.endswith('.jpeg')]) if os.path.exists(os.path.join(split_dir, 'PNEUMONIA')) else 0
        print(f"   {split_name}: {normal_count + pneumonia_count} images ({normal_count} Normal, {pneumonia_count} Pneumonia)")
    else:
        print(f"   ⚠️  {split_name} directory not found!")

print("\n" + "=" * 70)

# Build improved model
print("\n🏗️  Building improved model architecture...")
model = build_improved_model(input_shape=(224, 224, 3), dropout_rate=0.5)
print("✅ Model built successfully!")
print(f"\n📊 Model summary:")
model.summary()

# Create data generators with augmentation
print("\n📦 Creating data generators with augmentation...")
train_gen, val_gen, test_gen = create_data_generators(
    train_data_dir,
    val_data_dir,
    test_data_dir,
    batch_size=64,  # Increased batch size for larger dataset
    use_augmentation=True
)

# Calculate class weights for imbalanced data
print("\n⚖️  Calculating class weights...")
class_weights = calculate_class_weights(train_gen)

# Train model
print("\n🚀 Starting training with improved setup...")
history = train_improved_model(
    model,
    train_gen,
    val_gen,
    epochs=30,  # More epochs with early stopping
    batch_size=64,
    class_weights=class_weights,
    model_save_path=model_save_path,
    logs_dir=logs_dir
)

# Plot training metrics
print("\n📈 Plotting training metrics...")
plot_metrics(history)

# Evaluate on test set
print("\n🧪 Evaluating on test set...")
# Note: evaluate_model expects a generator, which we're providing
try:
    evaluate_model(model, test_gen)
except Exception as e:
    print(f"⚠️  Evaluation error: {e}")
    print("   Running basic evaluation...")
    results = model.evaluate(test_gen, verbose=1)
    print(f"   Test Loss: {results[0]:.4f}")
    print(f"   Test Accuracy: {results[1]:.4f}")
    if len(results) > 2:
        print(f"   Test Precision: {results[2]:.4f}")
        print(f"   Test Recall: {results[3]:.4f}")

# Final model save
print(f"\n💾 Saving final model to: {model_save_path}")
model.save(model_save_path)
print("✅ Training complete!")

print("\n" + "=" * 70)
print("📊 Training Summary:")
print(f"   Best validation loss: {min(history.history['val_loss']):.4f}")
print(f"   Best validation accuracy: {max(history.history['val_accuracy']):.4f}")
print(f"   Total epochs trained: {len(history.history['loss'])}")
print("=" * 70)
