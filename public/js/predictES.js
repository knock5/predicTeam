const predictBtn = document.getElementById("predict-button");

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

const calPrediksiES = () => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  const n = sessionData.length;
  const alpha = (2 / (n + 1)).toFixed(2);
  const totalAllDataPenjualan = sessionData.reduce(
    (total, current) => total + current.penjualan,
    0
  );
  const avgAllDataPenjualan = parseFloat(
    (totalAllDataPenjualan / n).toFixed(2)
  );
  const valDataTerakhir = parseFloat(sessionData.slice(-1)[0].penjualan);
  const resDtMinFt = parseFloat(
    (valDataTerakhir - avgAllDataPenjualan).toFixed(2)
  );
  const alphaTimesDtMinFt = parseFloat((alpha * resDtMinFt).toFixed(2));

  // hitung Ft (Prediksi)
  const resPrediksi = avgAllDataPenjualan + alphaTimesDtMinFt;

  // Menampilkan hasil prediksi dalam modal
  const modalTableBody = document.getElementById("modal-table-body");
  modalTableBody.innerHTML = `
  <tr>
    <th scope="row">Data Terakhir</th>
    <td class="text-center">${valDataTerakhir}</td>
  </tr>
  <tr>
    <th scope="row">Alpha</th>
    <td class="text-center">${alpha}</td>
  </tr>
  <tr>
    <th scope="row">Perbedaan Data Terakhir dan Forecast</th>
    <td class="text-center">${resDtMinFt}</td>
  </tr>
  <tr>
    <th scope="row">Alpha * Perbedaan</th>
    <td class="text-center">${alphaTimesDtMinFt}</td>
  </tr>
  <tr>
    <th scope="row">Hasil Prediksi</th>
    <td class="text-center">${resPrediksi}</td>
  </tr>
`;
};

predictBtn.addEventListener("click", calPrediksiES);

document.addEventListener("DOMContentLoaded", async () => {
  // cek data penjualan di session storage
  const storedDataPenjualan = JSON.parse(
    sessionStorage.getItem("dataPenjualan")
  );

  if (!storedDataPenjualan) {
    // get file penjualan.json
    const data = await getPenjualanJSON();
    // simpan data ke session storage
    sessionStorage.setItem("dataPenjualan", JSON.stringify(data));
  }

  renderDataTable();
});
