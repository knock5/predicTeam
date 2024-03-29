const ordeSelect = document.getElementById("orde");
const inputContainer = document.getElementById("input-container");
const predictwmaButton = document.getElementById("predict-button");

// Menjalankan fungsi untuk menampilkan input orde secara default
predictwmaButton.addEventListener("click", predictWMA);
// prediksi page
ordeSelect.addEventListener("change", updateInputFieldsMA);

function updateInputFieldsMA() {
  const ordeValue = parseInt(ordeSelect.value);
  inputContainer.innerHTML = "";

  for (let i = 1; i <= ordeValue; i++) {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("col-md-2", "mb-3");
    inputGroup.innerHTML = `
          <label for="data${i}" class="form-label">Penjualan-${i}</label>
          <input type="text" min="0" class="form-control dataInput" id="data${i}" name="data${i}" required>
          <div class="valid-feedback">
            Okaii!
          </div>
          <div class="invalid-feedback">
            Harap masukkan angka!
          </div>
        `;
    inputContainer.appendChild(inputGroup);
  }
  const dataInputs1 = document.querySelectorAll(".dataInput");

  // Ambil tombol Prediksi
  const predictButton1 = document.getElementById("predict-button");

  // Tambahkan event listener pada setiap input field
  dataInputs1.forEach((input) => {
    input.addEventListener("input", function () {
      const inputValue = input.value.trim();

      // Validasi input: pastikan input adalah angka
      if (!inputValue.match(/^\d+$/)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }

      // Cek apakah ada input field yang tidak valid atau kosong
      const isValidInputs1 = Array.from(dataInputs).every((input) => {
        const inputValue1 = input.value.trim();
        return inputValue1 !== "" && inputValue1.match(/^\d+$/);
      });

      // Disable atau enable tombol Prediksi berdasarkan hasil validasi input
      predictButton1.disabled = !isValidInputs;
    });
  });
}
updateInputFieldsMA();

// Ambil semua input fields dengan class 'dataInput'
const dataInputs = document.querySelectorAll(".dataInput");

// Ambil tombol Prediksi
const predictButton = document.getElementById("predict-button");

// Tambahkan event listener pada setiap input field
dataInputs.forEach((input) => {
  input.addEventListener("input", function () {
    const inputValue = input.value.trim();

    // Validasi input: pastikan input adalah angka
    if (!inputValue.match(/^\d+$/)) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }

    // Cek apakah ada input field yang tidak valid atau kosong
    const isValidInputs = Array.from(dataInputs).every((input) => {
      const inputValue = input.value.trim();
      return inputValue !== "" && inputValue.match(/^\d+$/);
    });

    // Disable atau enable tombol Prediksi berdasarkan hasil validasi input
    predictButton.disabled = !isValidInputs;
  });
});

function predictWMA() {
  const ordeValue = parseInt(ordeSelect.value);
  const ordeTotal = document.getElementById("ordeTotal");
  const totalPenjualan = document.getElementById("totalPenjualan");
  const hasilPrediksi = document.getElementById("hasilPrediksi");

  const data = [];

  for (let i = 1; i <= ordeValue; i++) {
    const input = document.getElementById(`data${i}`);
    if (input) {
      data.push(parseInt(input.value) || 0);
    }
  }

  // Mendefinisikan bobot berdasarkan periode yang dipilih
  let weights = [];
  if (ordeValue === 3) {
    weights = [0.5, 0.3, 0.2]; // Bobot untuk 3 periode
  } else if (ordeValue === 5) {
    weights = [0.2, 0.3, 0.2, 0.1, 0.2]; // Bobot untuk 5 periode
  } else if (ordeValue === 7) {
    weights = [0.1, 0.15, 0.2, 0.15, 0.1, 0.15, 0.15]; // Bobot untuk 7 periode
  }

  // hitung weighted moving average
  let weightedSum = 0;
  for (let i = 0; i < weights.length && i < data.length; i++) {
    weightedSum += data[data.length - 1 - i] * weights[i];
  }

  // penjumlahan total penjualan
  const totalSales = data.reduce((acc, curr) => acc + curr, 0);
  const toRoundedResult = Math.round(weightedSum);

  ordeTotal.innerText = `${ordeValue} Periode`;
  totalPenjualan.innerText = totalSales;
  hasilPrediksi.innerText = toRoundedResult;
}
