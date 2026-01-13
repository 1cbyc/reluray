# trying to build a method to identify diseases by the way they look in xrays

1. going about this project, first thing i did was setup my env using `source venv/bin/activate` 
2. once my env is setup, i installed the requirements i decided on earlier `pip install -r requirements.txt`
3. since all that is done, i setup the method to commit my progress as it comes
4. then i mapped the directory for the project so i will start creating the subfolders for the project
5. having done that, i want to use an existing medical imaging dataset i found on kaggle. so let me use the pneumonia detection dataset first. intend to use this chest xray images for pneumonia: https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
6. currently waiting for the download, so i can place the data in the `data/train`, `data/test` and `data/val` folders of the project. so i can have all sanple images of the identifiers for the diseases ready
```markdown
i wont lie, this dataset is so large it's 2gb despite compressed to fit.
```
7. i already fixed the whole data gathering, fucking 2gb worth of images to use. anyways, i want to write a script for preprocessing the images to help apply, resize and even normalize data augmentation 
8. so i did the function to preprocess the image identified to resize, and read and then return the image. i also did the function to handle data augmentation like the zoom range, horizontal flip, all those image adjustment features. so the data_augmentation() function is to return an ImageDataGenerator instance so as to perform realtime data augmentation while training the model
9. i want to work on building and training the model. but i am having worries if i should build the CNN model from scratch or i should just transfer learning with a pre-trained model like ResNet or VGG16.
10. i decided to just transfer learning with a pre-trained model, but i am using vgg16. what i did was simply used the vgg16 model as a base and added custom layers on top for binary classification in `src/model_training.py`
11. let me now train the model since i have the model already. will just use the data i imported.
12. i am done building the model and training the model, i need to visualize the model's performance metrics at this point at least, to decide the accuracy, precision and get to plot it over all training epochs hehe.
13. wo! let me just write a script to tain and evaluate the model, let me say: `train_and_evaluate.py`
14. oh shit! i think i just messed up the whole thing. let me create another model evaluation script. i made wrong twists with the import statements especially the fact that i should not have import y_pred from `scipy.special` so let me fix that.
15. since everything wan stress me, i downloaded weights online and put it in `weights/vgg16_weights_tf_dim_ordering_tf_kernels_notop.h5`. but then, now i need to change the whole base  model in the build model function to work with path instead of direct call.
16. making matters worse, this thing no wan use .h5; it wants .keras. which kind wahala be this bai. it is like i will go and change stuff in my train_model function from `checkpoint = ModelCheckpoint('best_model.h5', monitor='val_loss', save_best_only=True)` to `checkpoint = ModelCheckpoint('best_model.keras', monitor='val_loss', save_best_only=True)`
17. finally o, result don show:

[//]: # (![Screenshot of my successful run so far]&#40;readme-images/Screenshot-2024-09-02-at-9-06-28 PM.png&#41;)
![Screenshot of my successful run so far](readme-images/Screenshot-2024-09-02-at-10-09-54-PM.png)

_it has been three months, and i have decided to quickly work it out by getting it usable to the public. i just added a `src/predict.py` script to allow anyone who wants to run tests with scan images tho. it will work out. today is 23/12/2024._

18. Now, i added a `tests/scans` folder to put pseudo tests like i am a doctor or lab scientist. so will use that to match test first.
19. Having done that, i have updated the predict.py file with the link for single scan image, and want to run it `python3 src/predict.py`. will show the workings.

_maybe because i just bought another pc to run my AI expeditions i am having issues with my virtual environment, especially since it is windows and i have setup WSL, but seems broken. currently fixing it fully. once i do, i will push fully again. shouldn't take me past a few minutes._

_quickly removed the evn `rm -rf venv`, and restarted the env `python3 -m venv venv` and activated it `source venv/bin/activate`. going to reinstall all dependencies again and follow up. the reason for this journal is because i made this open source, so whoever likes this would see what i did and have been up to._


> while i am fixing that, let me create a section on how to use this.




# For Everyone's Use

It's worth noting that this project uses a Convolutional Neural Network (CNN) built on the VGG16 architecture for binary image classification, specifically for detecting pneumonia from chest X-rays.

## Interesting Things Currently
- Pretrained VGG16 as the base model
- Custom layers for binary classification
- Support for training, evaluation, and prediction

## How to Setup


1. **Clone the Repository**:
   ```bash
   git clone https://github.com/1cbyc/reluray.git
   cd reluray
   ```

2. **Create a Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Download Pretrained Weights**:
   - Download the VGG16 weights from [this link](https://storage.googleapis.com/tensorflow/keras-applications/vgg16/vgg16_weights_tf_dim_ordering_tf_kernels_notop.h5).
   - Place the file in the `models/` directory of this project.

5. **Prepare the Dataset**:
   - You should organize your dataset like this:
     ```
     data/
     ├── train/
     │   ├── class1/
     │   └── class2/
     ├── validation/
     │   ├── class1/
     │   └── class2/
     ```


## Training the Model

1. You should edit the `train_and_evaluate.py` file to configure the dataset paths:
   ```python
   train_data_dir = "data/train"
   val_data_dir = "data/validation"
   ```

2. Then, run the training script:
   ```bash
   python train_and_evaluate.py
   ```

3. The best model will be saved as `models/best_model.keras`.

_After training, need help using the Model for Prediction?_

## Using The Model for Prediction

1. Please make sure the trained model is available:
   ```bash
   ls models/best_model.keras
   ```

2. Then, update the `src/predict.py` file with the path to your test image:
   ```python
   image_path = "tests/scans/IM-0029-0001.jpeg"
   ```

3. Run the prediction script:
   ```bash
   python src/predict.py
   ```

4. The output will display the prediction and confidence score:
   ```
   Prediction: Pneumonia (Confidence: 0.95)
   ```




From where I'm standing, I think I need to make a webpage to allow people just upload scans directly and it will match with what is on the training model. I have no interest in allowing normies have to open the code every damn time.

20. Looking to create a small landing page in `templates` to allow file upload and then, will be set to run `python3 app.py` and hold my fucking peace!

<!-- _i have a small tiff with my wife, i guess i am making dinner myself tonight. She don tell me say make ah go warm eba chop! i would get back to this in a bit._ -->
21. encountered a small issue with my vritual environment again, trying to fix that. it's not `skill issues` anyways, so we move.


okay, seeing i am working an update for 2025:

## Usage

1. **Upload Image**: Drag & drop or click to upload a chest X-ray
2. **AI Analysis**: Our VGG16 model analyzes the image in seconds
3. **Get Results**: View prediction (Normal/Pneumonia) with confidence score
4. **Next Steps**: Follow medical recommendations based on results

## Deployment

ReluRay is deployed on:
- **Frontend**: [Vercel](https://vercel.com) - Global CDN, automatic deployments
- **Backend**: [Railway](https://railway.app) - FastAPI with Uvicorn

For detailed deployment instructions, see the deployment documentation in the repository.

### Quick Deploy

1. **Frontend (Vercel)**:
   - Connect GitHub repository
   - Set `REACT_APP_API_URL` environment variable
   - Deploy automatically on push

2. **Backend (Railway)**:
   - Connect GitHub repository
   - Railway auto-detects Python
   - Model file (`best_model.keras`) must be in repo
   - Deploy automatically on push

## Technical Details

### Frontend Stack
- **Framework**: React 18 with Create React App
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS with Starlink-inspired design
- **Font**: Poppins (Google Fonts)
- **Animations**: Framer Motion
- **Deployment**: Vercel

### Backend Stack
- **Framework**: FastAPI 0.109.0
- **ASGI Server**: Uvicorn 0.27.0 (production-ready)
- **ML Framework**: TensorFlow/Keras 2.16.1
- **Validation**: Pydantic 2.5.3
- **Deployment**: Railway
- **Production Ready**: FastAPI with Uvicorn ASGI server
- **API Documentation**: Automatic OpenAPI docs at `/api/docs`

### Model Architecture
- **Base Model**: VGG16 (pre-trained on ImageNet)
- **Custom Layers**: Dense layers for binary classification
- **Input Size**: 224x224x3 RGB images
- **Output**: Binary classification (Normal/Pneumonia)

### Training Data
- **Dataset**: Chest X-ray Pneumonia Dataset from Kaggle
- **Classes**: Normal (1,349 images), Pneumonia (3,883 images)
- **Split**: Train/Validation/Test with data augmentation
- **More Datasets**: Additional medical imaging datasets available in repository

### Performance
- **Accuracy**: ~95% on test set
- **Processing Time**: <3 seconds per image
- **Memory Usage**: Optimized for web deployment

### System Design
- **Architecture**: Comprehensive system design documentation available in repository
- **Scalability**: Designed for 1000+ concurrent users
- **Security**: CORS, HTTPS, input validation


**IMPORTANT**: This tool is for educational and research purposes only. It is not intended to replace professional medical diagnosis. Always consult with a qualified healthcare provider for medical decisions. Results should not be used as the sole basis for treatment decisions.


## If you want to contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup

**Quick Start (Automated):**
```bash
# Run setup script (handles Python 3.12 and all dependencies)
./setup.sh

# Then activate and run
source venv/bin/activate
cd api && python app.py  # Backend on http://localhost:5000
npm start  # Frontend on http://localhost:3000 (new terminal)
```

**Manual Setup:**
```bash
# 1. Python 3.12 environment (required for TensorFlow)
python3.12 -m venv venv  # or use pyenv: pyenv local 3.12.12
source venv/bin/activate
pip install -r requirements.txt

# 2. Frontend
npm install

# 3. Run
cd api && python app.py  # Backend
npm start  # Frontend (new terminal)
```

**Note**: Python 3.11 or 3.12 is required. TensorFlow doesn't support Python 3.13+ yet.


## License

This project is open source and available under the MIT License.

## Acknowledgments

- Chest X-ray dataset from Kaggle
- VGG16 architecture from Oxford Visual Geometry Group
- React and TensorFlow communities on stack overflow, thank you o!
- A private project I worked on with eClinic motivated me to do this

---

**Built with ❤️ for the medical community**

For questions or support, please open an issue on GitHub.