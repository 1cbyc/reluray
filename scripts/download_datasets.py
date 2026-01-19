#!/usr/bin/env python3
"""
Dataset Download Script for ReluRay
Downloads medical imaging datasets from Kaggle and other sources.
"""

import os
import sys
import subprocess
import json
from pathlib import Path

# Dataset configurations
DATASETS = {
    'covid19_radiography': {
        'name': 'COVID-19 Radiography Database',
        'kaggle_dataset': 'tawsifurrahman/covid19-radiography-database',
        'size_gb': 3,
        'format': 'PNG',
        'classes': ['Normal', 'COVID-19', 'Viral Pneumonia', 'Lung Opacity'],
        'status': 'pending'
    },
    'nih_chest_xray': {
        'name': 'NIH Chest X-ray Dataset',
        'kaggle_dataset': None,  # Direct download from NIH
        'size_gb': 112,
        'format': 'DICOM/PNG',
        'status': 'pending'
    },
    'rsna_pneumonia': {
        'name': 'RSNA Pneumonia Detection Challenge',
        'kaggle_dataset': 'covid19-pneumonia-detection-challenge',
        'size_gb': 65,
        'format': 'DICOM',
        'status': 'pending'
    },
    'vindr_cxr': {
        'name': 'VinDr-CXR Dataset',
        'kaggle_dataset': 'awsaf49/vindr-cxr-an-abnormalities-detection-dataset',
        'size_gb': 50,
        'format': 'DICOM',
        'status': 'pending'
    }
}

BASE_DIR = Path(__file__).parent.parent
RAW_DATA_DIR = BASE_DIR / 'data' / 'raw'
KAGGLE_CREDENTIALS = Path.home() / '.kaggle' / 'kaggle.json'


def check_kaggle_installed():
    """Check if Kaggle API is installed."""
    try:
        import importlib.util
        spec = importlib.util.find_spec("kaggle")
        return spec is not None
    except Exception:
        return False


def check_kaggle_credentials():
    """Check if Kaggle credentials are set up."""
    # Check environment variables first
    if os.getenv('KAGGLE_USERNAME') and os.getenv('KAGGLE_KEY'):
        return True
    
    # Check for credentials file
    if KAGGLE_CREDENTIALS.exists():
        try:
            with open(KAGGLE_CREDENTIALS, 'r') as f:
                creds = json.load(f)
                if 'username' in creds and 'key' in creds:
                    return True
        except Exception:
            pass
    return False


def install_kaggle():
    """Install Kaggle API."""
    print("📦 Installing Kaggle API...")
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'kaggle'])
    print("✅ Kaggle API installed successfully!")


def setup_kaggle_credentials():
    """Guide user to set up Kaggle credentials."""
    print("\n⚠️  Kaggle credentials not found!")
    print("\nTo download Kaggle datasets, you have two options:")
    print("\n📁 Option 1: Credentials File")
    print("1. Go to https://www.kaggle.com/account")
    print("2. Scroll to 'API' section")
    print("3. Click 'Create New API Token'")
    print("4. This downloads kaggle.json")
    print("5. Place it in ~/.kaggle/kaggle.json")
    print("6. Run: chmod 600 ~/.kaggle/kaggle.json")
    print("\n🔑 Option 2: Environment Variables")
    print("  export KAGGLE_USERNAME='your_username'")
    print("  export KAGGLE_KEY='your_api_key'")
    print("\nSetting up directory...")
    os.makedirs(Path.home() / '.kaggle', exist_ok=True)
    print("✅ Ready for credentials!")
    print("\n📖 See scripts/SETUP_KAGGLE.md for detailed instructions.")


def download_kaggle_dataset(dataset_id, output_dir):
    """Download a dataset from Kaggle."""
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        
        print(f"📥 Downloading {dataset_id}...")
        print(f"   Destination: {output_dir}")
        
        # Download dataset
        api.dataset_download_files(
            dataset_id,
            path=str(output_dir),
            unzip=True
        )
        
        print(f"✅ Successfully downloaded {dataset_id}!")
        return True
    except Exception as e:
        print(f"❌ Error downloading {dataset_id}: {e}")
        return False


def download_covid19_radiography():
    """Download COVID-19 Radiography Database."""
    dataset = DATASETS['covid19_radiography']
    output_dir = RAW_DATA_DIR / 'covid19-radiography'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*60}")
    print(f"Downloading: {dataset['name']}")
    print(f"Size: ~{dataset['size_gb']}GB")
    print(f"Format: {dataset['format']}")
    print(f"{'='*60}\n")
    
    if not check_kaggle_installed():
        install_kaggle()
    
    if not check_kaggle_credentials():
        setup_kaggle_credentials()
        print("\n⚠️  Please set up Kaggle credentials and run again.")
        return False
    
    success = download_kaggle_dataset(
        dataset['kaggle_dataset'],
        output_dir
    )
    
    if success:
        print(f"\n✅ Dataset downloaded to: {output_dir}")
        print(f"📁 Check the directory structure and proceed with preprocessing.")
        return True
    return False


def main():
    """Main function to download datasets."""
    print("🔬 ReluRay Dataset Downloader")
    print("=" * 60)
    
    # Create raw data directory
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"📁 Raw data directory: {RAW_DATA_DIR}")
    
    # Check what we already have
    existing_datasets = [d for d in RAW_DATA_DIR.iterdir() if d.is_dir()]
    if existing_datasets:
        print(f"\n📦 Existing datasets found:")
        for ds in existing_datasets:
            print(f"   - {ds.name}")
    
    # Start with smallest dataset: COVID-19 Radiography
    print("\n🎯 Starting with smallest dataset: COVID-19 Radiography Database")
    download_covid19_radiography()


if __name__ == '__main__':
    main()
