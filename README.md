# 🎓 Student Dropout Prediction - Jaya Jaya Institut

Proyek ini merupakan inisiatif analisis dan prediksi **dropout mahasiswa** pada institusi pendidikan tinggi **Jaya Jaya Institut**. Dengan pendekatan **data science dan machine learning**, proyek ini bertujuan membantu pihak kampus dalam:

* Mengidentifikasi mahasiswa yang berisiko tinggi putus studi (dropout).
* Memahami faktor-faktor yang memengaruhi keberhasilan akademik.
* Memberikan insight bagi kebijakan akademik dan layanan mahasiswa.

---
### 📄 Sumber Data

Dataset yang digunakan untuk proyek ini berasal dari repositori publik Dicoding. Dataset ini berisi beragam informasi terkait data demografis, sosio-ekonomi, dan akademik mahasiswa. Fitur-fitur utama mencakup detail pendaftaran (mode aplikasi, urutan pendaftaran, program studi), kualifikasi sebelumnya, informasi keluarga (kualifikasi dan pekerjaan orang tua), status beasiswa, kebutuhan khusus pendidikan, status finansial (tunggakan, biaya kuliah), serta performa akademik per semester (jumlah unit kurikuler yang diambil, dievaluasi, diluluskan, dan nilai). Variabel target adalah status akhir mahasiswa, yang mengindikasikan apakah mahasiswa tersebut **Dropout**, **Lulus** (Graduate), atau masih **Terdaftar** (Enrolled) – dalam kasus data `data.csv` Anda, ini direpresentasikan oleh kolom `Status` (kemungkinan 0 untuk Dropout dan 1 untuk Lulus).

Data ini sangat krusial untuk menganalisis pola dan faktor-faktor yang mempengaruhi keputusan mahasiswa untuk melanjutkan atau menghentikan studi, serta untuk membangun model prediktif guna mengidentifikasi mahasiswa yang berisiko dropout.

📎 Link Dataset (Sumber Asli/Referensi):
[https://github.com/dicodingacademy/dicoding_dataset/blob/main/students_performance/data.csv](https://github.com/dicodingacademy/dicoding_dataset/blob/main/students_performance/data.csv)
📎 Link streamlit (Sumber Asli/Referensi):
[https://3yiswuyyvktcxbzqv7lnyn.streamlit.app/](https://3yiswuyyvktcxbzqv7lnyn.streamlit.app/)

# 📊 Business Dashboard - Analisis Dropout Mahasiswa

Dashboard interaktif ini dikembangkan menggunakan **Looker Studio** untuk menganalisis fenomena **dropout mahasiswa** berdasarkan data dari `data.csv`. Tujuan utama dashboard adalah membantu institusi pendidikan memahami faktor-faktor penyebab mahasiswa dropout serta memberikan wawasan yang dapat ditindaklanjuti.

---

## 🔑 Ringkasan Insight & Visualisasi

### 🎯 KPI Utama (Key Performance Indicators):

* **Rata-rata Nilai Semester 1 Mahasiswa Lulus:** 12.64
* **Rata-rata Nilai Semester 1 Mahasiswa Dropout:** 7.26
* **Rata-rata Kelulusan Unit Semester 1 Mahasiswa Lulus:** 13,767
* **Rata-rata Kelulusan Unit Semester 1 Mahasiswa Dropout:** 3,626

### 📊 Visualisasi Distribusi Dropout:

* **Top 5 Program Studi dengan Dropout Tertinggi:**

  1. Biofuel Production Technologies
  2. Informatics
  3. Equiniculture
  4. Management
  5. Basic Education

### 📈 Analisis Performa Akademik:

* **Approved Units vs Enrolled Units Semester 1 & 2:**

  * Mahasiswa **lulus** menyelesaikan lebih banyak unit daripada yang **dropout**.
* **Distribusi Nilai Semester 1 & 2:**

  * Mahasiswa dropout dominan di nilai < 12
  * Mahasiswa lulus dominan di nilai 12–17

### 🎛️ Filter Interaktif:

* **Course Name**
* **Attendance**
* **Gender**

---

## 🔍 Temuan Utama

1. **Tingkat Dropout yang Tinggi pada Program Tertentu**

   * Biofuel Production Technologies mencatat tingkat dropout tertinggi.

2. **Performa Akademik sebagai Prediktor Dropout**

   * Nilai dan jumlah unit yang disetujui pada semester pertama berperan besar.
   * Dropout memiliki nilai rata-rata semester 1 yang rendah (7.26).

3. **Distribusi Nilai dan Kelulusan Unit**

   * Lulusan cenderung memiliki nilai yang stabil dan menyelesaikan lebih banyak unit.

4. **Potensi Segmentasi Berdasarkan Filter Demografis**

   * Dengan filter interaktif, pengguna bisa mengeksplorasi lebih lanjut faktor penyebab dropout berdasarkan gender, attendance, dan program studi.

---

## 🌐 Link Dashboard Interaktif

[Klik untuk membuka dashboard Looker Studio](https://lookerstudio.google.com/reporting/551cbbdc-c372-482f-a128-018b2cdca93e)
[Klik untuk membuka Streamlit](https://lookerstudio.google.com/reporting/551cbbdc-c372-482f-a128-018b2cdca93e)

---


## 🧠 Modeling

### ⚖️ Algoritma yang Digunakan

Model yang digunakan dalam proyek ini adalah:

* **Random Forest Classifier** ✅ *(terbaik)*
* **Logistic Regression**
* **XGBoost Classifier**

---

## 📈 Evaluasi Model

Berdasarkan hasil evaluasi:

* **Model Terbaik**: Random Forest
* **Akurasi Model**: **95%**
* **Evaluasi Tambahan**:

  * Confusion Matrix
  * Feature Importance

Model ini mampu secara akurat mengidentifikasi mahasiswa yang berisiko dropout berdasarkan atribut seperti status pernikahan, jenis kelamin, mode pendaftaran, nilai masuk, dan lainnya.

---

## ▶️ Menjalankan Proyek

### 1️⃣ Buat dan Aktifkan Virtual Environment

```bash
# Buat environment
python -m venv venv

# Aktifkan di Windows
venv\Scripts\activate

# Aktifkan di Mac/Linux
source venv/bin/activate
```

### 2️⃣ Instalasi Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Jalankan Aplikasi Streamlit

```bash
streamlit run main.py
```

Fungsi utama script:

* Membersihkan data
* Melatih model terbaik (Random Forest)
* Menampilkan prediksi dan hasil evaluasi
* Menyediakan antarmuka input untuk data baru

---

## 📁 Struktur Direktori Proyek

```
student-dropout-predictor/
│
├── data/
│   └── data.csv
├── model/
│   └── random_forest_model.pkl
│   └── preprocessor.pkl
├── main.py
├── Rafli_Nur_Tugas.ipynb
├── requirements.txt
├── dashboard/
│   └── Rapurikalanikov-dashboard.png
├── README.md
```

---

## ✅ Kesimpulan Akhir

Proyek ini membuktikan bahwa pendekatan berbasis **data science dan machine learning** sangat efektif dalam membantu institusi pendidikan seperti **Jaya Jaya Institut** dalam:

* Mendeteksi lebih awal potensi mahasiswa yang berisiko mengalami **dropout**.
* Memahami faktor-faktor utama yang memengaruhi kelulusan dan putus studi.
* Memberikan wawasan berbasis data untuk pengambilan kebijakan akademik yang lebih baik.

Dengan model **Random Forest** yang mencapai **akurasi 95%**, serta dukungan visualisasi dalam bentuk **dashboard interaktif**, proyek ini dapat menjadi alat bantu pengambilan keputusan yang penting bagi pihak manajemen institusi.

---

## 💡 Rekomendasi untuk Institusi

1. **Lakukan monitoring rutin** terhadap mahasiswa dengan status akademik rentan berdasarkan prediksi model.
2. **Perkuat sistem bimbingan akademik dan konseling**, terutama untuk mahasiswa tahun pertama atau yang memiliki latar belakang akademik lemah.
3. **Tingkatkan komunikasi antara dosen wali, mahasiswa, dan pihak akademik** agar intervensi dapat dilakukan lebih dini.
4. **Gunakan data secara berkala untuk evaluasi kebijakan**, seperti kurikulum, beban studi, dan layanan mahasiswa.
5. **Kembangkan sistem notifikasi berbasis prediksi**, yang memberi sinyal peringatan ketika mahasiswa menunjukkan pola risiko dropout.

---
