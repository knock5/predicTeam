const ordeSelect = document.getElementById("orde");
const inputContainer = document.getElementById("input-container");
const predictButton = document.getElementById("predict-button");

// Menjalankan fungsi untuk menampilkan input orde secara default
updateInputFields();

ordeSelect.addEventListener("change", updateInputFields);
predictButton.addEventListener("click", predict);

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
