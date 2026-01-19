"""
Improved Model Training for ReluRay
Enhanced architecture, data augmentation, and training practices
"""

from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, 
    TensorBoard, CSVLogger
)
import os
import numpy as np


def build_improved_model(input_shape=(224, 224, 3), dropout_rate=0.5):
    """
    Build improved model with better architecture:
    - GlobalAveragePooling2D instead of Flatten (reduces overfitting)
    - BatchNormalization for stability
    - Dropout for regularization
    - Better layer structure
    """
    # Load VGG16 base model
    current_dir = os.path.dirname(os.path.abspath(__file__))
    weights_path = os.path.join(current_dir, '..', '..', 'weights', 
                                'vgg16_weights_tf_dim_ordering_tf_kernels_notop.h5')
    weights_path = os.path.abspath(weights_path)
    
    if not os.path.exists(weights_path):
        print(f"⚠️  Local weights not found at {weights_path}, using ImageNet weights")
        base_model = VGG16(weights='imagenet', include_top=False, input_shape=input_shape)
    else:
        base_model = VGG16(weights=weights_path, include_top=False, input_shape=input_shape)
    
    # Freeze base model layers (we can unfreeze later for fine-tuning)
    base_model.trainable = False
    
    # Build improved model
    inputs = base_model.input
    x = base_model.output
    
    # Use GlobalAveragePooling2D instead of Flatten (better for transfer learning)
    x = GlobalAveragePooling2D()(x)
    
    # Add BatchNormalization
    x = BatchNormalization()(x)
    
    # First dense layer with dropout
    x = Dense(256, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(dropout_rate)(x)
    
    # Second dense layer with dropout
    x = Dense(128, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(dropout_rate * 0.5)(x)  # Less dropout in second layer
    
    # Output layer
    outputs = Dense(1, activation='sigmoid')(x)
    
    model = Model(inputs=inputs, outputs=outputs)
    
    # Compile with improved optimizer settings
    # Note: precision/recall metrics may not be available in all TF versions
    try:
        from tensorflow.keras.metrics import Precision, Recall
        metrics = ['accuracy', Precision(name='precision'), Recall(name='recall')]
    except ImportError:
        metrics = ['accuracy']  # Fallback for older TF versions
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),  # Start with higher LR
        loss='binary_crossentropy',
        metrics=metrics
    )
    
    return model


def create_data_generators(train_dir, val_dir, test_dir, batch_size=32, 
                          use_augmentation=True):
    """
    Create data generators with comprehensive augmentation for training
    """
    if use_augmentation:
        # Training data generator with augmentation
        train_datagen = ImageDataGenerator(
            rescale=1.0/255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest',
            brightness_range=[0.8, 1.2],  # Brightness variation
            channel_shift_range=0.1  # Color variation
        )
    else:
        train_datagen = ImageDataGenerator(rescale=1.0/255)
    
    # Validation and test generators (no augmentation)
    val_test_datagen = ImageDataGenerator(rescale=1.0/255)
    
    # Create generators
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='binary',
        shuffle=True,
        seed=42
    )
    
    val_generator = val_test_datagen.flow_from_directory(
        val_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='binary',
        shuffle=False,
        seed=42
    )
    
    test_generator = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='binary',
        shuffle=False,
        seed=42
    )
    
    return train_generator, val_generator, test_generator


def calculate_class_weights(train_generator):
    """
    Calculate class weights to handle imbalanced datasets
    """
    class_counts = train_generator.classes
    total = len(class_counts)
    class_0_count = np.sum(class_counts == 0)
    class_1_count = np.sum(class_counts == 1)
    
    weight_0 = total / (2 * class_0_count)
    weight_1 = total / (2 * class_1_count)
    
    class_weights = {0: weight_0, 1: weight_1}
    
    print(f"📊 Class distribution:")
    print(f"   Class 0 (Normal): {class_0_count} samples")
    print(f"   Class 1 (Pneumonia): {class_1_count} samples")
    print(f"   Class weights: {class_weights}")
    
    return class_weights


def train_improved_model(model, train_generator, val_generator, 
                        epochs=30, batch_size=32, class_weights=None,
                        model_save_path='best_model.keras',
                        logs_dir='logs'):
    """
    Train model with improved callbacks and monitoring
    """
    # Create logs directory
    os.makedirs(logs_dir, exist_ok=True)
    
    # Callbacks
    callbacks = [
        # Save best model
        ModelCheckpoint(
            model_save_path,
            monitor='val_loss',
            save_best_only=True,
            save_weights_only=False,
            mode='min',
            verbose=1
        ),
        
        # Early stopping to prevent overfitting
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        
        # Reduce learning rate on plateau
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        
        # TensorBoard for visualization (optional, may not be available)
        # TensorBoard(
        #     log_dir=logs_dir,
        #     histogram_freq=1,
        #     write_graph=True,
        #     update_freq='epoch'
        # ),
        
        # CSV logger
        CSVLogger(
            os.path.join(logs_dir, 'training.log'),
            append=False
        )
    ]
    
    # Calculate steps per epoch
    steps_per_epoch = len(train_generator)
    validation_steps = len(val_generator)
    
    print(f"\n🚀 Starting training...")
    print(f"   Steps per epoch: {steps_per_epoch}")
    print(f"   Validation steps: {validation_steps}")
    print(f"   Total epochs: {epochs}")
    print(f"   Batch size: {batch_size}\n")
    
    # Train model
    history = model.fit(
        train_generator,
        steps_per_epoch=steps_per_epoch,
        epochs=epochs,
        validation_data=val_generator,
        validation_steps=validation_steps,
        callbacks=callbacks,
        class_weight=class_weights,
        verbose=1
    )
    
    return history


def unfreeze_and_finetune(model, train_generator, val_generator,
                         epochs=10, fine_tune_lr=1e-5):
    """
    Unfreeze some layers for fine-tuning (optional advanced step)
    """
    print("\n🔧 Fine-tuning: Unfreezing last few layers...")
    
    # Unfreeze last 3 blocks of VGG16
    base_model = model.layers[0]
    base_model.trainable = True
    
    # Freeze early layers, unfreeze later layers
    for layer in base_model.layers[:-6]:
        layer.trainable = False
    for layer in base_model.layers[-6:]:
        layer.trainable = True
    
    # Recompile with lower learning rate
    try:
        from tensorflow.keras.metrics import Precision, Recall
        metrics = ['accuracy', Precision(name='precision'), Recall(name='recall')]
    except ImportError:
        metrics = ['accuracy']
    
    model.compile(
        optimizer=Adam(learning_rate=fine_tune_lr),
        loss='binary_crossentropy',
        metrics=metrics
    )
    
    print(f"   Trainable layers: {sum([l.trainable for l in model.layers])}")
    
    # Continue training
    history = model.fit(
        train_generator,
        steps_per_epoch=len(train_generator),
        epochs=epochs,
        validation_data=val_generator,
        validation_steps=len(val_generator),
        verbose=1
    )
    
    return history
