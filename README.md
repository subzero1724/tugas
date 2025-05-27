# 🧠 Proyek Akhir: Analisis dan Prediksi Attrition Karyawan PT Jaya Jaya Maju

## 📍 Ringkasan Proyek

PT **Jaya Jaya Maju**, perusahaan di sektor **Edutech**, menghadapi tantangan serius terkait **tingginya angka karyawan resign (attrition)**. Proyek ini bertujuan untuk:

* Menganalisis pola dan penyebab utama karyawan resign.
* Membangun model prediktif menggunakan **Machine Learning**.
* Menyediakan **dashboard interaktif** untuk mendukung pengambilan keputusan oleh tim HR.
* Memberikan **rekomendasi strategis** untuk menurunkan angka attrition dan meningkatkan retensi karyawan.

---

## 💼 1. Business Understanding

### 🌟 Permasalahan Bisnis

* Angka resign yang tinggi mengganggu kelangsungan operasional dan produktivitas.
* Belum diketahui faktor dominan penyebab karyawan resign.
* Sulitnya mengidentifikasi karyawan yang berpotensi resign secara dini.

### ✅ Tujuan Proyek

* Mengidentifikasi faktor-faktor utama penyebab resign.
* Memprediksi karyawan yang berisiko tinggi untuk resign.
* Memberikan rekomendasi kebijakan berbasis data kepada manajemen HR.

---

## 2. Persiapan

### 📄 Sumber Data

Dataset yang digunakan berasal dari repositori publik Dicoding dan berisi informasi terkait data karyawan seperti umur, departemen, job role, level pekerjaan, status lembur, lama bekerja, dan status attrition (resign atau tidak). Data ini digunakan untuk menganalisis pola resign serta membangun model prediktif attrition.

📎 Link Dataset:
https://github.com/dicodingacademy/dicoding_dataset/blob/main/employee/employee_data.csv

---

## 📊 3. Business Dashboard

Dashboard dibuat menggunakan **Looker Studio**, menampilkan insight utama seperti:

* **Attrition rate** saat ini sebesar **12%**.
* **Distribusi attrition** berdasarkan departemen dan job role.
* Korelasi antara **OverTime**, **JobLevel**, dan **YearsAtCompany** terhadap attrition.
* Hasil prediksi model Machine Learning.

📎 Link Dashboard:
[https://lookerstudio.google.com/reporting/d48d085e-e9e4-4a65-a48b-637afd486138](https://lookerstudio.google.com/reporting/d48d085e-e9e4-4a65-a48b-637afd486138)

---

## 🔍 4. Temuan Utama

1. **Attrition Rate** perusahaan saat ini adalah **12%**.
2. Departemen dengan tingkat resign tertinggi:

   * **Sales**
   * **Research & Development**
3. Job role dengan tingkat resign tinggi:

   * **Sales Executive**
   * **Laboratory Technician**
4. Faktor utama penyebab resign:

   * **OverTime** → Karyawan lembur cenderung lebih banyak resign.
   * **JobLevel rendah** (Level 1–2) → Potensi resign lebih tinggi.
   * **YearsAtCompany < 3 tahun** → Masa kerja pendek meningkatkan risiko resign.

---

## 🤖 5. Machine Learning Modeling

### ⚖️ Algoritma yang Digunakan

* **Random Forest Classifier**

### ⚙️ Fitur Penting dalam Model

* `OverTime`
* `MonthlyIncome`
* `JobLevel`
* `YearsAtCompany`

### 📈 Hasil Evaluasi

* **Akurasi Model**: **87%**
* **Confusion Matrix** dan **Feature Importance** digunakan untuk evaluasi performa.

---

## 💻 6. Menajalnkan File Prediksi

### 1️⃣ Membuat dan Mengaktifkan Virtual Environment (venv)

Agar lingkungan pengembangan tetap terisolasi, ikuti langkah berikut:

```bash
# Membuat virtual environment
python -m venv venv

# Mengaktifkan virtual environment (Windows)
venv\Scripts\activate

# Atau jika menggunakan Mac/Linux
source venv/bin/activate
```

### 2️⃣ Instalasi dan Setup

Setelah virtual environment aktif:

```bash
pip install -r requirements.txt
```

### 3️⃣ Jalankan Prediksi

Setelah semua dependensi terinstal:

```bash
python prediction.py
```

Script akan:

* Membersihkan data.
* Melatih model Random Forest.
* Menampilkan hasil evaluasi dan prediksi karyawan baru.

---
## 📦 7. Struktur Direktori Proyek

```
employee-attrition-project/
│
├── data/
│   └── employee_data.csv
├── model/
│   └── rf_model.pkl
├── predict.py
├── requirements.txt
├── dashboard/
│   └── Rapurikalanikov-dashboard.png
├── README.md
```

---

## ✅ Kesimpulan Akhir

Proyek ini menunjukkan bahwa pendekatan berbasis **data science dan machine learning** dapat membantu perusahaan Edutech seperti **PT Jaya Jaya Maju** dalam:

* Mengidentifikasi akar penyebab karyawan resign.
* Mengembangkan sistem peringatan dini berbasis prediksi.
* Merumuskan kebijakan HR yang **lebih proaktif dan efisien**.

Dengan **dashboard interaktif**, **akurasi model 87%**, serta **rekomendasi berbasis data**, proyek ini diharapkan dapat **menurunkan attrition rate secara signifikan** dan **meningkatkan retensi karyawan**, mendukung pertumbuhan dan stabilitas perusahaan di masa depan.

---
## 💡 Rekomendasi untuk Tim HR

1. **Tinjau kembali kebijakan lembur** untuk mengurangi beban kerja berlebih.
2. **Perkuat program onboarding dan mentoring** untuk karyawan baru.
3. **Tawarkan jalur karier yang jelas** kepada karyawan dengan level rendah.
4. **Manfaatkan model prediksi attrition** untuk mendeteksi karyawan berisiko resign sejak dini.

---
