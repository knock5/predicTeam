const predictButton = document.getElementById("predict-button");
const valueXInput = document.getElementById("value-x");

// get data penjualan.json
const getPenjualanJSON = async () => {
  try {
    const response = await fetch("/data/penjualan.json");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error: ", error);
  }
};

// render data table penjualan
const renderDataTable = () => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;
  const tablePenjualan = document.getElementById("table-penjualan");

  // cek data
  if (sessionData.length === 0) {
    tablePenjualan.innerHTML = `
      <tr>
        <td colspan="3">Data penjualan tidak tersedia.</td>
      </tr>
    `;
  } else {
    tablePenjualan.innerHTML = `
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Bulan</th>
        <th>Penjualan</th>
      </tr>
    </thead>
    <tbody id="tabody">
    </tbody>
  `;
  }

  const tabody = document.getElementById("tabody");

  sessionData.forEach((data, index) => {
    tabody.innerHTML += `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${data.bulan}</td>
        <td class="text-center">${data.penjualan}</td>
      </tr>
    `;
  });
};

function isNumber(value) {
  return /^\d+$/.test(value);
}

function checkInput() {
  const inputValue = valueXInput.value.trim();

  if (
    isNumber(inputValue) &&
    inputValue !== "" &&
    inputValue !== "0" &&
    !(inputValue.startsWith("0") && inputValue.length > 1)
  ) {
    predictButton.disabled = false;
  } else {
    predictButton.disabled = true;
  }
}

// hitung prediksi LR
const calPredictLR = () => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  const nomorUrutan = [];
  const totalPenjualan = [];

  sessionData.forEach((data, index) => {
    nomorUrutan.push(index + 1);
    totalPenjualan.push(data.penjualan);
  });

  const totalX = nomorUrutan.reduce((total, current) => total + current, 0);
  const totalY = totalPenjualan.reduce((total, current) => total + current, 0);

  const xy = nomorUrutan.map((x, index) => x * totalPenjualan[index]);
  const totalXY = xy.reduce((total, current) => total + current, 0);
  const xSquared = nomorUrutan.map((x) => x * x);
  const totalXSquared = xSquared.reduce((total, current) => total + current, 0);

  // Hitung rata-rata dari data X dan data Y
  const avgX = (totalX / nomorUrutan.length).toFixed(2);
  const avgY = (totalY / totalPenjualan.length).toFixed(2);

  // Hitung rata-rata dari data X yang dipangkatkan dua
  const resAvgXSquared = Math.pow(avgX, 2).toFixed(2);

  // Hitung nilai b
  const n = nomorUrutan.length;
  const nxy = (n * avgX * avgY).toFixed(2);
  const topB = (totalXY - nxy).toFixed(2);
  const nxSquared = (n * resAvgXSquared).toFixed(2);
  const botB = (totalXSquared - nxSquared).toFixed(2);
  const b = parseFloat((topB / botB).toFixed(2));

  // Hitung nilai a
  const bx = (b * avgX).toFixed(2);
  const a = parseFloat((avgY - bx).toFixed(2));

  const xValue = valueXInput.value;

  const resYbx = parseFloat((b * xValue).toFixed(2));
  const y = a + resYbx;
  const resY = Math.round(y);

  // Buat tabel untuk menampilkan hasil perhitungan
  const tableHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Metrik</th>
          <th>Nilai</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total X</td>
          <td>${totalX}</td>
        </tr>
        <tr>
          <td>Total Y</td>
          <td>${totalY}</td>
        </tr>
        <tr>
          <td>Total XY</td>
          <td>${totalXY}</td>
        </tr>
        <tr>
          <td>Total X Squared</td>
          <td>${totalXSquared}</td>
        </tr>
        <tr>
          <td>Nilai a</td>
          <td>${a}</td>
        </tr>
        <tr>
          <td>Nilai b</td>
          <td>${b}</td>
        </tr>
      </tbody>
    </table>
    <h4>Hasil Prediksi</h4>
    <p>Hasil Prediksi pada bulan (${xValue}): ${resY} Penjualan</p>
  `;

  // Tampilkan tabel hasil perhitungan pada modal
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = tableHTML;
};

predictButton.addEventListener("click", calPredictLR);
valueXInput.addEventListener("input", checkInput);

document.addEventListener("DOMContentLoaded", async () => {
  // cek data penjualan di session storage
  const storedDataPenjualan = JSON.parse(
    sessionStorage.getItem("dataPenjualan")
  );

  valueXInput.value = "";

  checkInput();

  if (!storedDataPenjualan) {
    // get file penjualan.json
    const data = await getPenjualanJSON();
    // simpan data ke session storage
    sessionStorage.setItem("dataPenjualan", JSON.stringify(data));
  }

  // render table penjualan
  renderDataTable();
});
