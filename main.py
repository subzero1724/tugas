import streamlit as st
import pandas as pd
import joblib

# Load model dan preprocessor
try:
    model = joblib.load("model/random_forest_model.pkl")
    preprocessor = joblib.load("model/preprocessor.pkl")
except FileNotFoundError:
    st.error("Model or preprocessor file not found. Make sure 'model/random_forest_model.pkl' and 'model/preprocessor.pkl' exist.")
    st.stop() 

st.title("Prediksi Dropout Mahasiswa 🎓")

st.write("Masukkan data mahasiswa untuk memprediksi apakah akan **Dropout** atau **Graduate**.")
st.caption("Isi semua field di bawah ini dengan cermat.")

# Form input data
with st.form("student_form"):
    st.subheader("Informasi Pribadi dan Pendaftaran")
    # Grouping related inputs for better UI
    col1, col2, col3 = st.columns(3)
    with col1:
        Marital_status = st.selectbox("Status Pernikahan", [1, 2, 3, 4, 5], help="1-Single, 2-Married, 3-Widower, 4-Divorced, 5-Facto union")
        Application_mode = st.number_input("Mode Aplikasi", min_value=1, max_value=50, value=1, help="Kode mode aplikasi pendaftaran.")
        Application_order = st.number_input("Urutan Aplikasi", min_value=0, value=1, help="Urutan pendaftaran (0 jika tidak ada urutan).") # Min value can be 0
        Course = st.number_input("Kode Program Studi", min_value=1, value=33, help="Kode program studi yang diambil.")
        Daytime_evening_attendance = st.selectbox("Waktu Kehadiran", [0, 1], format_func=lambda x: "Malam" if x == 0 else "Siang", help="0=Malam, 1=Siang")

    with col2:
        Previous_qualification = st.number_input("Kualifikasi Sebelumnya", min_value=1, max_value=50, value=1, help="Kode kualifikasi pendidikan sebelumnya.")
        Nacionality = st.number_input("Kewarganegaraan", min_value=1, max_value=100, value=1, help="Kode kewarganegaraan.")
        # Using the correct expected column name: Mothers_qualification
        Mother_qualification_input = st.number_input("Kualifikasi Ibu", min_value=1, max_value=50, value=1, help="Kode kualifikasi pendidikan ibu.")
        # Using the correct expected column name: Fathers_qualification
        Father_qualification_input = st.number_input("Kualifikasi Ayah", min_value=1, max_value=50, value=1, help="Kode kualifikasi pendidikan ayah.")
        Gender = st.selectbox("Jenis Kelamin", [0, 1], format_func=lambda x: "Wanita" if x == 0 else "Pria", help="0=Wanita, 1=Pria")

    with col3:
        Educational_special_needs = st.selectbox("Kebutuhan Khusus Pendidikan", [0, 1], format_func=lambda x: "Ya" if x == 1 else "Tidak", help="Apakah memiliki kebutuhan khusus?")
        Debtor = st.selectbox("Memiliki Hutang", [0, 1], format_func=lambda x: "Ya" if x == 1 else "Tidak", help="Apakah mahasiswa memiliki hutang biaya kuliah?")
        Tuition_fees_up_to_date = st.selectbox("Biaya Kuliah Lunas", [0, 1], format_func=lambda x: "Ya" if x == 1 else "Tidak", help="Apakah biaya kuliah sudah lunas?")
        Scholarship_holder = st.selectbox("Penerima Beasiswa", [0, 1], format_func=lambda x: "Ya" if x == 1 else "Tidak")
        Age_at_enrollment = st.number_input("Usia Saat Pendaftaran", min_value=15, max_value=80, value=18)
        International = st.selectbox("Mahasiswa Internasional", [0, 1], format_func=lambda x: "Ya" if x == 1 else "Tidak")

    st.subheader("Data Akademik Semester 1")
    col_s1_1, col_s1_2, col_s1_3, col_s1_4, col_s1_5 = st.columns(5)
    with col_s1_1:
        Curricular_units_1st_sem_enrolled = st.number_input("SKS Diambil (Sem 1)", min_value=0, value=6)
    with col_s1_2:
        Curricular_units_1st_sem_evaluations = st.number_input("Evaluasi (Sem 1)", min_value=0, value=6)
    with col_s1_3:
        Curricular_units_1st_sem_approved = st.number_input("SKS Lulus (Sem 1)", min_value=0, value=6)
    with col_s1_4:
        Curricular_units_1st_sem_grade = st.number_input("Nilai Rata-rata (Sem 1)", min_value=0.0, max_value=20.0, value=15.0, step=0.1, format="%.1f")
    with col_s1_5:
        Curricular_units_1st_sem_without_evaluations = st.number_input("Tanpa Evaluasi (Sem 1)", min_value=0, value=0)

    st.subheader("Data Akademik Semester 2")
    col_s2_1, col_s2_2, col_s2_3, col_s2_4, col_s2_5 = st.columns(5)
    with col_s2_1:
        Curricular_units_2nd_sem_enrolled = st.number_input("SKS Diambil (Sem 2)", min_value=0, value=6)
    with col_s2_2:
        Curricular_units_2nd_sem_evaluations = st.number_input("Evaluasi (Sem 2)", min_value=0, value=6)
    with col_s2_3:
        Curricular_units_2nd_sem_approved = st.number_input("SKS Lulus (Sem 2)", min_value=0, value=5)
    with col_s2_4:
        Curricular_units_2nd_sem_grade = st.number_input("Nilai Rata-rata (Sem 2)", min_value=0.0, max_value=20.0, value=14.0, step=0.1, format="%.1f")
    with col_s2_5:
        Curricular_units_2nd_sem_without_evaluations = st.number_input("Tanpa Evaluasi (Sem 2)", min_value=0, value=0)

    st.subheader("Indikator Ekonomi Makro")
    col_econ_1, col_econ_2, col_econ_3 = st.columns(3)
    with col_econ_1:
        Unemployment_rate = st.number_input("Tingkat Pengangguran (%)", value=10.0, step=0.1, format="%.1f")
    with col_econ_2:
        Inflation_rate = st.number_input("Tingkat Inflasi (%)", value=1.2, step=0.1, format="%.1f")
    with col_econ_3:
        GDP = st.number_input("PDB (GDP)", value=2.1, step=0.1, format="%.1f")

    submitted = st.form_submit_button("Prediksi Status Mahasiswa")

# Prediksi
if submitted:
    # Create a dictionary with the input data
    data_dict = {
        'Marital_status': Marital_status,
        'Application_mode': Application_mode,
        'Application_order': Application_order,
        'Course': Course,
        'Daytime_evening_attendance': Daytime_evening_attendance,
        'Previous_qualification': Previous_qualification,
        'Nacionality': Nacionality,
        'Mothers_qualification': Mother_qualification_input,
        'Fathers_qualification': Father_qualification_input,
        'Educational_special_needs': Educational_special_needs,
        'Debtor': Debtor,
        'Tuition_fees_up_to_date': Tuition_fees_up_to_date,
        'Gender': Gender,
        'Scholarship_holder': Scholarship_holder,
        'Age_at_enrollment': Age_at_enrollment,
        'International': International,
        'Curricular_units_1st_sem_enrolled': Curricular_units_1st_sem_enrolled,
        'Curricular_units_1st_sem_evaluations': Curricular_units_1st_sem_evaluations,
        'Curricular_units_1st_sem_approved': Curricular_units_1st_sem_approved,
        'Curricular_units_1st_sem_grade': Curricular_units_1st_sem_grade,
        'Curricular_units_1st_sem_without_evaluations': Curricular_units_1st_sem_without_evaluations,
        'Curricular_units_2nd_sem_enrolled': Curricular_units_2nd_sem_enrolled,
        'Curricular_units_2nd_sem_evaluations': Curricular_units_2nd_sem_evaluations,
        'Curricular_units_2nd_sem_approved': Curricular_units_2nd_sem_approved,
        'Curricular_units_2nd_sem_grade': Curricular_units_2nd_sem_grade,
        'Curricular_units_2nd_sem_without_evaluations': Curricular_units_2nd_sem_without_evaluations,
        'Unemployment_rate': Unemployment_rate,
        'Inflation_rate': Inflation_rate,
        'GDP': GDP,

        # Kolom tambahan yang dibutuhkan preprocessor (jika ada dan tidak diinput user)
        'Mothers_occupation': 0, 
        'Fathers_occupation': 0, 
        'Curricular_units_1st_sem_credited': 0, 
        'Curricular_units_2nd_sem_credited': 0, 
        'Displaced': 0, 
        'Previous_qualification_grade': 0.0, 
        'Admission_grade': 0.0 
    }
    input_data = pd.DataFrame([data_dict])

    st.write("---")
    st.subheader("Memproses Prediksi...")

    try:
        transformed_input = preprocessor.transform(input_data)
        prediction = model.predict(transformed_input)
        prediction_proba = model.predict_proba(transformed_input)

        hasil = prediction[0] 
        confidence = prediction_proba[0][hasil]


        st.subheader("🎉 Hasil Prediksi 🎉")
        if hasil == 1: 
            st.success(f"Status Mahasiswa: **Graduate** 🎓")
            st.balloons()
        else: 
            st.error(f"Status Mahasiswa: **Dropout** ❌")

        st.write(f"Tingkat Keyakinan Prediksi: **{confidence * 100:.2f}%**")


    except ValueError as e:
        st.error(f"Terjadi kesalahan saat transformasi data: {e}")
        st.error("Pastikan semua fitur yang diharapkan oleh model telah disediakan dan dalam format yang benar.")
        st.info("Detail Error: " + str(e))
    except Exception as e:
        st.error(f"Terjadi kesalahan yang tidak terduga: {e}")

else:
    st.info("Silakan isi formulir di atas dan klik tombol 'Prediksi Status Mahasiswa' untuk melihat hasilnya.")

st.markdown("---")
st.markdown("Aplikasi ini dibuat untuk memprediksi status dropout mahasiswa berdasarkan data historis.")
