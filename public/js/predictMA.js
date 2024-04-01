const ordeSelect = document.getElementById("orde");
const inputContainer = document.getElementById("input-container");
const predictButton = document.getElementById("predict-button");

updateInputFieldsMA();

// prediksi page
ordeSelect.addEventListener("change", updateInputFieldsMA);
predictButton.addEventListener("click", predict);

function updateInputFieldsMA() {
  const ordeValue = parseInt(ordeSelect.value);
  inputContainer.innerHTML = "";
  predictButton.disabled = true;

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

  // Menambahkan pendengar acara pada setiap input data
  const dataInputs = document.querySelectorAll(".dataInput");
  dataInputs.forEach((input) => {
    input.addEventListener("input", validateInputs);
  });
}

function validateInputs() {
  const dataInputs = document.querySelectorAll(".dataInput");
  let allValid = true;

  dataInputs.forEach((input) => {
    const inputValue = input.value.trim();
    if (!inputValue.match(/^\d+$/)) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      allValid = false;
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }
  });

  predictButton.disabled = !allValid;
}

function predict() {
  const ordeValue = parseInt(ordeSelect.value);
  const ordeTotal = document.getElementById("ordeTotal");
  const totalPenjualan = document.getElementById("totalPenjualan");
  const hasilPrediksi = document.getElementById("hasilPrediksi");

  const data = [];

  // Dapatkan nilai dari setiap input data yang valid
  const dataInputs = document.querySelectorAll(".dataInput");
  dataInputs.forEach((input) => {
    const inputValue = input.value.trim();
    if (inputValue !== "") {
      data.push(parseInt(inputValue));
    }
  });

  // hitung moving average (MA)
  // hitung total penjualan
  const total = data.reduce((acc, curr) => acc + curr, 0);
  // hitung rata-rata penjualan
  const result = total / data.length;
  const toRoundedResult = Math.round(result);

  ordeTotal.innerText = `${ordeValue} Bulan`;
  totalPenjualan.innerText = total;
  hasilPrediksi.innerText = toRoundedResult;
}
