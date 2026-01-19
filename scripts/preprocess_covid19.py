#!/usr/bin/env python3
"""
Preprocessing script for COVID-19 Radiography Database
Integrates the dataset with existing ReluRay data structure.
"""

import os
import shutil
from pathlib import Path
from PIL import Image
import numpy as np

BASE_DIR = Path(__file__).parent.parent
RAW_DATA_DIR = BASE_DIR / 'data' / 'raw' / 'covid19-radiography'
OUTPUT_DIR = BASE_DIR / 'data'

# Mapping COVID-19 dataset classes to ReluRay structure
CLASS_MAPPING = {
    'Normal': 'NORMAL',
    'COVID': 'PNEUMONIA',  # COVID-19 is a type of pneumonia
    'COVID-19': 'PNEUMONIA',  # Alternative naming
    'Viral Pneumonia': 'PNEUMONIA',
    'Lung_Opacity': 'PNEUMONIA',  # Lung opacity often indicates pneumonia
    'Lung Opacity': 'PNEUMONIA'  # Alternative naming with space
}

SPLIT_RATIOS = {
    'train': 0.7,
    'val': 0.15,
    'test': 0.15
}


def find_dataset_structure(raw_dir):
    """Find the structure of the downloaded dataset."""
    # COVID-19 dataset typically has structure like:
    # COVID-19_Radiography_Dataset/
    #   ├── COVID/
    #   ├── Normal/
    #   ├── Viral Pneumonia/
    #   └── Lung_Opacity/
    
    # Check for nested structure first
    nested_dir = raw_dir / 'COVID-19_Radiography_Dataset'
    if nested_dir.exists():
        folders = [f for f in nested_dir.iterdir() 
                  if f.is_dir() and not f.name.startswith('.')]
        if folders:
            return folders
    
    # Check for direct structure
    folders = [f for f in raw_dir.iterdir() 
              if f.is_dir() and not f.name.startswith('.')]
    
    return folders


def preprocess_image(image_path, target_size=(224, 224)):
    """Preprocess a single image."""
    try:
        img = Image.open(image_path)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        return img
    except Exception as e:
        print(f"⚠️  Error processing {image_path}: {e}")
        return None


def get_image_files(class_dir):
    """Get all image files from a class directory."""
    image_extensions = {'.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'}
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(list(class_dir.glob(f'*{ext}')))
        image_files.extend(list(class_dir.glob(f'**/*{ext}')))  # Recursive
    
    return image_files


def split_dataset(image_files, train_ratio, val_ratio, test_ratio):
    """Split dataset into train/val/test."""
    np.random.seed(42)  # For reproducibility
    np.random.shuffle(image_files)
    
    total = len(image_files)
    train_end = int(total * train_ratio)
    val_end = train_end + int(total * val_ratio)
    
    return {
        'train': image_files[:train_end],
        'val': image_files[train_end:val_end],
        'test': image_files[val_end:]
    }


def process_class(class_folder, output_class_name, raw_dir):
    """Process all images in a class folder."""
    print(f"\n📁 Processing class: {class_folder.name} → {output_class_name}")
    
    image_files = get_image_files(class_folder)
    print(f"   Found {len(image_files)} images")
    
    if len(image_files) == 0:
        print(f"   ⚠️  No images found in {class_folder}")
        return
    
    # Split dataset
    splits = split_dataset(image_files, 
                          SPLIT_RATIOS['train'],
                          SPLIT_RATIOS['val'],
                          SPLIT_RATIOS['test'])
    
    # Process and copy images
    for split_name, files in splits.items():
        split_dir = OUTPUT_DIR / split_name / output_class_name
        split_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"   📦 {split_name}: {len(files)} images")
        
        for img_file in files:
            processed_img = preprocess_image(img_file)
            if processed_img:
                # Save as JPEG to match existing format
                output_path = split_dir / f"{img_file.stem}.jpeg"
                processed_img.save(output_path, 'JPEG', quality=95)
    
    print(f"   ✅ Completed processing {class_folder.name}")


def main():
    """Main preprocessing function."""
    print("🔬 COVID-19 Radiography Database Preprocessing")
    print("=" * 60)
    
    if not RAW_DATA_DIR.exists():
        print(f"❌ Raw data directory not found: {RAW_DATA_DIR}")
        print("   Please download the dataset first using:")
        print("   python3 scripts/download_datasets.py")
        return
    
    # Find dataset structure
    class_folders = find_dataset_structure(RAW_DATA_DIR)
    
    if not class_folders:
        print(f"❌ Could not find dataset structure in {RAW_DATA_DIR}")
        print("\n📁 Current directory structure:")
        for item in sorted(RAW_DATA_DIR.rglob('*'))[:20]:
            if item.is_dir():
                print(f"   📁 {item.relative_to(RAW_DATA_DIR)}")
        return
    
    print(f"\n✅ Found {len(class_folders)} class folders:")
    for folder in class_folders:
        print(f"   - {folder.name}")
    
    # Process each class
    for class_folder in class_folders:
        output_class = CLASS_MAPPING.get(class_folder.name)
        if output_class:
            process_class(class_folder, output_class, RAW_DATA_DIR)
        else:
            print(f"⚠️  Skipping unknown class: {class_folder.name}")
    
    print("\n" + "=" * 60)
    print("✅ Preprocessing complete!")
    print(f"\n📊 Dataset statistics:")
    
    for split in ['train', 'val', 'test']:
        split_dir = OUTPUT_DIR / split
        if split_dir.exists():
            for class_name in ['NORMAL', 'PNEUMONIA']:
                class_dir = split_dir / class_name
                if class_dir.exists():
                    count = len(list(class_dir.glob('*.jpeg')))
                    print(f"   {split}/{class_name}: {count} images")


if __name__ == '__main__':
    main()
