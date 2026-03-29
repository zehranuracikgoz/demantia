**Dil / Language:** [🇹🇷 Türkçe](#türkçe) · [🇬🇧 English](#english)
---
<a name="türkçe"></a>

# Demantia — Alzheimer Tespit Uygulaması

Demantia, beyin MRI görüntülerini yapay zeka ile analiz ederek Alzheimer hastalığının evresini otomatik olarak sınıflandıran bir web uygulamasıdır. Kullanıcı, MRI görüntüsünü yükler; sistem derin öğrenme modeli aracılığıyla anında sonucu ekrana getirir. Web tarayıcısı üzerinden çalışır.

## Teknolojiler

* Python · FastAPI · Uvicorn
* TensorFlow / Keras
* Pillow · NumPy
* HTML · CSS · JavaScript

## Özellikler

* MRI görüntüsü yükleme (JPEG, JPG, PNG)
* 4 seviyeli Alzheimer sınıflandırması (NonDemented → ModerateDemented)
* Anlık tahmin — görüntü yüklenir yüklenmez sonuç gösterilir
* REST API desteği — `/predict` endpoint'i üzerinden entegrasyon

## Alzheimer Evreleri

| Sınıf | Açıklama |
|---|---|
| `NonDemented` | Demans belirtisi yok |
| `VeryMildDemented` | Çok hafif demans |
| `MildDemented` | Hafif demans |
| `ModerateDemented` | Orta düzey demans |

## Süreç

Proje, nörolojik hastalıkların erken tespitindeki en kritik soruna odaklanır: uzman olmayan kişilerin MRI sonuçlarını yorumlayamaması. Bunun için önce dört sınıflı bir CNN modeli eğitildi, ardından bu modeli sarmalayan bir FastAPI servisi yazıldı. Arayüz kasıtlı olarak sade tutuldu; tek bir işlem — görüntü yükle, sonucu gör — ön planda.

## Projeyi Çalıştırma

```bash
# Bağımlılıkları yükle
pip install fastapi uvicorn tensorflow pillow numpy python-multipart

# Sunucuyu başlat
python app.py

# Tarayıcıda aç
# index.html dosyasını doğrudan açın ya da:
python -m http.server 5500
```

## API

`POST /predict` — MRI görüntüsü alır, sınıf adı ve ham tahmin döndürür.

```json
{
  "raw_prediction": [[0.02, 0.05, 0.88, 0.05]],
  "class_id": 2,
  "class_name": "MildDemented"
}
```

## Not

Bu uygulama yalnızca **akademik ve araştırma amaçlıdır**. Tıbbi teşhis veya klinik karar vermek için kullanılmamalıdır. Kesin tanı için mutlaka bir sağlık profesyoneline başvurunuz.

---

<a name="english"></a>

# Demantia — Alzheimer Detection App

Demantia is a web application that automatically classifies the stage of Alzheimer's disease by analyzing brain MRI images with artificial intelligence. The user uploads an MRI image; the system instantly returns the result via a deep learning model. Runs in any web browser.

## Technologies

* Python · FastAPI · Uvicorn
* TensorFlow / Keras
* Pillow · NumPy
* HTML · CSS · JavaScript

## Features

* MRI image upload (JPEG, JPG, PNG)
* 4-level Alzheimer classification (NonDemented → ModerateDemented)
* Instant prediction — result shown as soon as the image is uploaded
* REST API support — integration via `/predict` endpoint

## Alzheimer Stages

| Class | Description |
|---|---|
| `NonDemented` | No signs of dementia |
| `VeryMildDemented` | Very mild dementia |
| `MildDemented` | Mild dementia |
| `ModerateDemented` | Moderate dementia |

## The Process

The project addresses the most critical problem in neurological disease screening: non-specialists being unable to interpret MRI results. To solve this, a four-class CNN model was trained first, then a FastAPI service was built to wrap the model. The interface was intentionally kept minimal — a single action, upload an image and see the result, takes center stage.

## Running the Project

```bash
# Install dependencies
pip install fastapi uvicorn tensorflow pillow numpy python-multipart

# Start the server
python app.py

# Open in browser
# Open index.html directly, or:
python -m http.server 5500
```

## API

`POST /predict` — Accepts an MRI image, returns the class name and raw prediction.

```json
{
  "raw_prediction": [[0.02, 0.05, 0.88, 0.05]],
  "class_id": 2,
  "class_name": "MildDemented"
}
```

## Note

This application is intended **for academic and research purposes only**. It should not be used for medical diagnosis or clinical decision-making. Please consult a healthcare professional for a definitive diagnosis.
