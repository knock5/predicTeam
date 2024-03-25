const ordeSelect = document.getElementById("orde");
const inputContainer = document.getElementById("input-container");
const predictButton = document.getElementById("predict-button");
const predictWmaButton = document.getElementById("predictWMA-button");
// Menjalankan fungsi untuk menampilkan input orde secara default
updateInputFields();

ordeSelect.addEventListener("change", updateInputFields);
predictButton.addEventListener("click", predict);
predictWmaButton.addEventListener("click", predictWMA);
function updateInputFields() {
  const ordeValue = parseInt(ordeSelect.value);
  inputContainer.innerHTML = "";

  for (let i = 1; i <= ordeValue; i++) {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("col-md-2", "mb-3");
    inputGroup.innerHTML = `
        <label for="data${i}" class="form-label">Penjualan-${i}</label>
        <input type="number" min="0" class="form-control dataInput" id="data${i}" name="data${i}" required>
        <div class="valid-feedback">
          Okaii!
        </div>
        <div class="invalid-feedback">
          Harap masukkan angka!
        </div>
      `;
    inputContainer.appendChild(inputGroup);
  }
}

function predict() {
  const ordeValue = parseInt(ordeSelect.value);
  const ordeTotal = document.getElementById("ordeTotal");
  const totalPenjualan = document.getElementById("totalPenjualan");
  const hasilPrediksi = document.getElementById("hasilPrediksi");

  const data = [];

  for (let i = 1; i <= ordeValue; i++) {
    const input = document.getElementById(`data${i}`);

    if (input) {
      const inputValue = input.value.trim();

      // Validasi input: pastikan input adalah angka
      if (!inputValue.match(/^\d+$/)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return; // Hentikan eksekusi jika input tidak valid
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }

      data.push(parseInt(inputValue) || 0);
    }
  }

  // hitung total penjualan
  const total = data.reduce((acc, curr) => acc + curr, 0);
  const result = total / data.length;
  const toRoundedResult = Math.round(result);

  ordeTotal.innerText = `${ordeValue} Bulan`;
  totalPenjualan.innerText = total;
  hasilPrediksi.innerText = toRoundedResult;
}

function predictWMA() {
  const ordeValue = parseInt(ordeSelect.value);
  const ordeTotal = document.getElementById("ordeTotal");
  const totalPenjualan = document.getElementById("totalPenjualan");
  const hasilPrediksi = document.getElementById("hasilPrediksi");

  const data = [];

  for (let i = 1; i <= ordeValue; i++) {
    const input = document.getElementById(`data${i}`);

    if (input) {
      const inputValue = input.value.trim();

      // Validasi input: pastikan input adalah angka
      if (!inputValue.match(/^\d+$/)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return; // Hentikan eksekusi jika input tidak valid
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }

      data.push(parseInt(inputValue) || 0);
    }
  }

  // Mendefinisikan bobot berdasarkan periode yang dipilih
  let weights = [];
  if (ordeValue === 3) {
    weights = [0.3, 0.5, 0.2]; // Bobot untuk 3 periode
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
  const totalSales = data.reduce((acc, curr) => acc + curr, 0);
  const toRoundedResult = Math.round(weightedSum);

  ordeTotal.innerText = `${ordeValue} Periode`;
  totalPenjualan.innerText = totalSales;
  hasilPrediksi.innerText = toRoundedResult;
}
