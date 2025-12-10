const drop = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const box = document.getElementById("diagnosisBox");

drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    drop.style.background = "#ecfeff";
    drop.style.borderColor = "#06b6d4";
});

drop.addEventListener("dragleave", () => {
    drop.style.background = "#f8fafc";
    drop.style.borderColor = "#cbd5e1";
});

drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.style.background = "#f8fafc";
    drop.style.borderColor = "#cbd5e1";
    fileInput.files = e.dataTransfer.files;
    showPreview();
});

fileInput.onchange = showPreview;

function showPreview() {
    const file = fileInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
}

analyzeBtn.onclick = async function () {

    if (!preview.src || preview.style.display === "none") {
        alert("Lütfen önce bir MR görüntüsü yükleyin!");
        return;
    }

    box.innerHTML = `
        <i class="ri-loader-4-line ri-spin" style="font-size: 3rem; color: #06b6d4;"></i>
        <p style="margin-top:15px; color:#64748b;">Analiz yapılıyor...</p>
    `;

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = "Analiz Ediliyor...";

    try {
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        const API_URL = "http://127.0.0.1:8000/predict";

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            let errorMessage = `Sunucu Hatası: ${response.status} ${response.statusText}`;
         
            try {
                const errorData = await response.json();
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
            } catch (jsonError) {
                console.error("Yanıt JSON olarak okunamadı:", jsonError);
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const predicted = data.class_name;
        
        let baslik, renk, ikon, mesaj;

        if (predicted === "NonDemented") {
            baslik = "⚠️ DEMANS BULGUSU TESPİT EDİLDİ";
            renk = "#ef4444";
            ikon = "ri-alert-fill";
            mesaj = `Analiz tamamlandı.`;
        } else {
            baslik = "🌟 DEMANS BULGUSU YOK";
            renk = "#10b981";
            ikon = "ri-checkbox-circle-line";
            mesaj = `Analiz tamamlandı.`;
        }

        box.innerHTML = `
            <i class="${ikon}" style="font-size: 4rem; color: ${renk}; margin-bottom: 15px;"></i>
            <h3 style="color: ${renk}; margin:0; font-size: 1.6rem;">${baslik}</h3>
            <p style="color: #64748b; margin-top: 10px;">${mesaj}</p>
        `;

    } catch (error) {
        console.error("Hata:", error);
        
        const isNetworkError = error.message.includes("Failed to fetch") || error.message.includes("NetworkError");
        
        let baslik = isNetworkError ? "🔌 Bağlantı Hatası" : "Analiz Hatası";
        let ikon = isNetworkError ? "ri-wifi-off-line" : "ri-error-warning-line";
        let anaMesaj = isNetworkError ? "Backend'e ulaşılamadı. Sunucunuzu kontrol edin." : error.message;

        box.innerHTML = `
            <i class="${ikon}" style="font-size: 3rem; color: #ef4444;"></i>
            <h3 style="color: #ef4444; margin: 10px 0;">${baslik}</h3>
            <p style="color: #94a3b8;">${anaMesaj}</p>
        `;
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="ri-refresh-line"></i> Yeni Analiz Yap';
    }
};
