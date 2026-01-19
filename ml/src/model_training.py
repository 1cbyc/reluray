#to build the model i used this calls
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.optimizers import Adam
# to train the model, i added these calls
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint

def build_model(input_shape=(224, 224, 3)):
    # let me load the VGG16 model with the weights i downloaded already
    import os
    # Get absolute path to weights file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    weights_path = os.path.join(current_dir, '..', '..', 'weights', 'vgg16_weights_tf_dim_ordering_tf_kernels_notop.h5')
    weights_path = os.path.abspath(weights_path)
    
    if not os.path.exists(weights_path):
        # Fallback to using ImageNet weights if local weights not found
        print(f"⚠️  Local weights not found at {weights_path}, using ImageNet weights")
        base_model = VGG16(weights='imagenet', include_top=False, input_shape=input_shape)
    else:
        # base_model = VGG16(weights='imagenet', include_top=False, input_shape=input_shape)
        base_model = VGG16(weights=weights_path, include_top=False, input_shape=input_shape)

    model = Sequential([
        base_model,
        Flatten(),
        Dense(128, activation='relu'),
        Dense(1, activation='sigmoid') # clear binary classification (if pneumonia or not)
    ])

    model.compile(optimizer=Adam(learning_rate=0.0001),
                  loss='binary_crossentropy',
                  metrics=['accuracy'])

    return model
# what i did here is used the vgg16 model as a base and added custom layers on top for binary classification

def train_model(model, train_data_dir, val_data_dir, batch_size=32, epochs=10):
    datagen = ImageDataGenerator(rescale=1.0/255, validation_split=0.2)

    train_generator = datagen.flow_from_directory(train_data_dir, target_size=(224, 224), batch_size=batch_size, class_mode='binary')
    val_generator = datagen.flow_from_directory(val_data_dir, target_size=(224, 224), batch_size=batch_size, class_mode='binary')

    # checkpoint = ModelCheckpoint('best_model.h5', monitor='val_loss', save_best_only=True)
    # i decided to change this to allow me train while saving the model in the .keras format instead of the .h5
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    model_path = os.path.join(base_dir, 'best_model.keras')
    checkpoint = ModelCheckpoint(model_path, monitor='val_loss', save_best_only=True)

    history = model.fit(train_generator, epochs=epochs, validation_data=val_generator, callbacks=[checkpoint])
    return history
# what i did here was to train the model with the prepared data seeing i have now built it