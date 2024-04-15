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
      const isValidInputs1 = Array.from(dataInputs1).every((input) => {
        const inputValue = input.value.trim();
        return inputValue !== "" && inputValue.match(/^\d+$/);
      });
      // Disable atau enable tombol Prediksi berdasarkan hasil validasi input
      predictButton1.disabled = !isValidInputs1;
    });
  });
}
updateInputFieldsMA();

function predictWMA() {
  const ordeValue = parseInt(ordeSelect.value);
  const tableBody = document.getElementById("modal-table-body");

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
    weights = [0.3, 0.2, 0.2, 0.2, 0.1]; // Bobot untuk 5 periode
  } else if (ordeValue === 7) {
    weights = [0.2, 0.15, 0.15, 0.15, 0.15, 0.1, 0.1]; // Bobot untuk 7 periode
  }

  // hitung weighted moving average
  const dataWMA = [];

  let tableContent = "";

  for (let i = 0; i < weights.length && i < data.length; i++) {
    const hasil = data[data.length - 1 - i] * weights[i];

    const newData = {
      penjualan: data[data.length - 1 - i],
      bobot: weights[i],
      hasil: hasil,
    };

    dataWMA.push(newData);

    tableContent += `
      <tr>
        <td class="col-7 table-info">Bulan ${i + 1}</td>
        <td>${data[i]}</td>
        <td>${weights[weights.length - 1 - i]}</td>
      </tr>`;
  }

  const calWMA = dataWMA.reduce((total, data) => total + data.hasil, 0);
  const resWMA = Math.round(calWMA);

  const resTotalPenjualan = dataWMA.reduce(
    (total, data) => total + data.penjualan,
    0
  );

  let tableContent0 = `
      <tr>
        <th class="col-7 table-info">Jumlah Orde</th>
        <td class="col-5" colspan="2">${ordeValue} Bulan</td>
      </tr>
      <tr>
        <th class="col-7 table-info">Periode</th>
        <th class="col-4 table-info">Data Penjualan</th>
        <th class="col-2 table-info">Bobot</th>
      </tr>
    `;

  let tableContent1 = `
      <tr>
        <th class="col-7 table-info">Total Seluruh Penjualan</th>
        <td class="col-5"  colspan="2">${resTotalPenjualan}</td>
      </tr>
      <tr>
        <th class="col-7 table-info">Hasil Prediksi (Bulan Depan)</th>
        <td class="col-5" colspan="2">${resWMA}</td>
      </tr>
    `;

  tableBody.innerHTML = tableContent0 + tableContent + tableContent1;
}
