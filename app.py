from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image, UnidentifiedImageError
import numpy as np
import uvicorn
import io 

try:
    model = load_model("alzheimer_detection_model.h5")
except Exception as e:
    print(f"HATA: Model yüklenemedi. Model dosyasını kontrol edin. Hata: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    if not file.content_type.startswith("image/"):
        accepted_formats = "JPEG, JPG ve PNG"
        raise HTTPException(
            status_code=400,
            detail=f"Desteklenmeyen dosya türü. Lütfen bir MR görüntüsü ({accepted_formats}) yükleyin."
        )
    
    contents = await file.read()
    
    try:
        img = Image.open(io.BytesIO(contents))
        
        img = img.convert("RGB").resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)

        pred = model.predict(img)
        class_id = np.argmax(pred)

        classes = ["NonDemented", "VeryMildDemented", "MildDemented", "ModerateDemented"]

        return {
            "raw_prediction": pred.tolist(),
            "class_id": int(class_id),
            "class_name": classes[class_id]
        }
        
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Yüklenen dosya tanınabilir bir görüntü formatında değil veya bozuk (JPEG, JPG veya PNG bekliyoruz)."
        )
    except Exception as e:
        print(f"Görüntü işleme/tahmin hatası: {e}")
        raise HTTPException(
            status_code=500,
            detail="Sunucu tarafında görüntü işlenirken beklenmeyen bir hata oluştu."
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)