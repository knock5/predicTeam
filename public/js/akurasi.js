const tambahButton = document.getElementById("tambah-data");
const akurasiButton = document.getElementById("hitung-akurasi");
const inputBulan = document.getElementById("bulan");
const inputPenjualan = document.getElementById("penjualan");
const metodeSelected = document.getElementById("metode-akurasi");

// cek session storage
if (typeof Storage !== "undefined") {
  console.log("Session storage tersedia.");
} else {
  swal.fire({
    title: "Error!",
    text: "Maaf, Browser ini tidak mendukung session storage.",
    icon: "error",
  });
}

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
        <th>Aksi</th>
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
        <td class="text-center">
          <button class="btn btn-warning btn-sm" onclick="onEdit(${
            data.id
          })">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="onDelete(${
            data.id
          })">Hapus</button>
        </td>
      </tr>
    `;
  });
};

// add data penjualan
const addDataPenjualan = () => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  const id = new Date().getTime();
  const bulan = inputBulan.value;
  const penjualan = parseFloat(inputPenjualan.value);

  const newData = {
    id,
    bulan,
    penjualan,
  };

  if (!bulan || !penjualan) {
    swal.fire({
      title: "Error!",
      text: "Silahkan isi data penjualan terlebih dahulu.",
      icon: "error",
    });

    return;
  }

  // validasi penjualan input angka
  if (isNaN(penjualan)) {
    swal.fire({
      title: "Error!",
      text: "Data penjualan harus berupa angka.",
      icon: "error",
    });

    return;
  }

  sessionData.push(newData);
  sessionStorage.setItem("dataPenjualan", JSON.stringify(storedData));

  inputBulan.value = "";
  inputPenjualan.value = "";

  swal.fire({
    title: "Data berhasil ditambahkan!",
    text: "Data penjualan berhasil ditambahkan ke session storage.",
    icon: "success",
  });

  renderDataTable();
};

// edit data penjualan
const onEdit = (id) => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;
  const data = sessionData.find((data) => data.id === id);

  swal
    .fire({
      title: "Edit Data Penjualan",
      html: `
      <label for="modal-bulan" class="form-label">Bulan</label>
      <select name="bulan" id="modal-bulan" class="form-select">
            <option value="${data.bulan}" selected hidden>${data.bulan}</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>
      <label for="penjualan" class="form-label">Penjualan</label>
      <input type="text" id="modal-penjualan" class="form-control" value="${data.penjualan}" required>
    `,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    })
    .then((result) => {
      if (result.isConfirmed) {
        const newData = {
          id,
          bulan: document.getElementById("modal-bulan").value,
          penjualan: parseFloat(
            document.getElementById("modal-penjualan").value
          ),
        };

        // validasi penjualan input angka
        if (isNaN(newData.penjualan) || newData.penjualan === "") {
          swal.fire({
            title: "Error!",
            text: "Data penjualan harus berupa angka.",
            icon: "error",
          });

          return;
        }

        const updatedData = sessionData.map((data) =>
          data.id === id ? newData : data
        );

        storedData.data = updatedData;
        sessionStorage.setItem("dataPenjualan", JSON.stringify(storedData));

        swal.fire({
          title: "Success!",
          text: "Data penjualan berhasil diubah.",
          icon: "success",
        });

        renderDataTable();
      }
    });
};

// delete data penjualan
const onDelete = (id) => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  swal
    .fire({
      title: "Hapus Data Penjualan",
      text: "Apakah Anda yakin ingin menghapus data penjualan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    })
    .then((result) => {
      if (result.isConfirmed) {
        const updatedData = sessionData.filter((data) => data.id !== id);

        storedData.data = updatedData;
        sessionStorage.setItem("dataPenjualan", JSON.stringify(storedData));

        swal.fire({
          title: "Success!",
          text: "Data penjualan berhasil dihapus.",
          icon: "success",
        });

        renderDataTable();
      }
    });

  renderDataTable();
};

// hitung akurasi MA 3 orde
const calAkurasiMA3 = () => {
  const storedDataPenjualan = JSON.parse(
    sessionStorage.getItem("dataPenjualan")
  );
  const jumlahOrde = 3;
  const resData = storedDataPenjualan.data;

  // cek minimal 4 data aktual penjualan
  if (resData.length < 4) {
    swal.fire({
      title: "Error",
      text: "Perhitungan harus memiliki data aktual minimal 4 bulan",
      icon: "error",
    });

    return;
  }

  // avg MA3
  const dataMA = [];

  for (let i = jumlahOrde; i < resData.length; i++) {
    const avg =
      resData
        .slice(i - jumlahOrde, i)
        .reduce((sum, entry) => sum + entry.penjualan, 0) / jumlahOrde;

    // push prediksi ke dalam array
    dataMA.push({
      bulan: resData[i].bulan,
      prediksi: Math.round(avg),
    });
  }

  // Dt-Ft
  const dataDtFt = [];

  for (let i = 0; i < dataMA.length; i++) {
    const aktual = resData[i + jumlahOrde].penjualan;
    const prediksi = dataMA[i].prediksi;

    // Hitung selisih absolut
    const selisih = Math.abs(aktual - prediksi);

    dataDtFt.push({
      bulan: resData[i + jumlahOrde].bulan,
      dtft: selisih,
    });
  }

  // (Dt-Ft)^2
  const dataDtFtSquared = [];

  for (let i = 0; i < dataDtFt.length; i++) {
    const bulan = dataDtFt[i].bulan;
    const dtft = dataDtFt[i].dtft;
    const squared = Math.pow(dtft, 2);

    dataDtFtSquared.push({
      bulan: bulan,
      squared: squared,
    });
  }

  // (Dt-Ft)/Dt
  const dataDtFtDivDt = [];

  for (let i = 0; i < dataMA.length; i++) {
    const bulan = dataMA[i].bulan;
    const aktual = resData[i + jumlahOrde].penjualan;
    const prediksi = dataMA[i].prediksi;

    const selisih = Math.abs(aktual - prediksi);

    if (aktual !== 0) {
      let hasil = selisih / aktual;
      hasil = parseFloat(hasil.toFixed(2));

      dataDtFtDivDt.push({
        bulan: bulan,
        nilai: hasil,
      });
    } else {
      dataDtFtDivDt.push({
        bulan: bulan,
        nilai: NaN,
      });
    }
  }

  // avg seluruh prediksi MA
  const sumPrediksi = dataMA.reduce(
    (total, current) => total + current.prediksi,
    0
  );
  const resAvgPrediksi = Math.round(sumPrediksi / dataMA.length);
  // jumlah Dt-Ft
  const sumDtFt = dataDtFt.reduce((total, current) => total + current.dtft, 0);
  // jumlah (Dt-Ft)^2
  const sumDtFtSquared = dataDtFtSquared.reduce(
    (total, current) => total + current.squared,
    0
  );
  // jumlah (Dt-Ft)/Dt
  const sumDtFtDivDt = dataDtFtDivDt.reduce(
    (total, current) => total + current.nilai,
    0
  );

  // value n
  const n = dataMA.length;
  // MAD = SUM(Dt-Ft) / n
  const resMAD = parseFloat(sumDtFt / n).toFixed(2);
  // MSE = (SUM(Dt-Ft)^2) / n
  const resMSE = parseFloat(sumDtFtSquared / n).toFixed(2);
  // %MAPE = (SUM(Dt-Ft)/Dt) / n
  const valMAPE = parseFloat(sumDtFtDivDt / n).toFixed(4);
  const resMAPE = valMAPE * 100;
  const resMAPERound = resMAPE.toFixed(2);
  // SE = (SUM(Dt-Ft)^2 / (n - 2))
  const calSE = Math.sqrt(sumDtFtSquared / (n - 2));
  const resSE = parseFloat(calSE).toFixed(2);
  // Hasil akurasi = 100% - MAPE
  const resAcc = 100 - resMAPE;

  console.log("MA3: ", dataMA);
  console.log("Dt-Ft: ", dataDtFt);
  console.log("(Dt-Ft)^2: ", dataDtFtSquared);
  console.log("(Dt-Ft)/Dt: ", dataDtFtDivDt);
  console.log("n: ", n);
  console.log("MAD: ", resMAD);
  console.log("MSE: ", resMSE);
  console.log("MAPE: ", resMAPE);
  console.log("SE: ", resSE);
  console.log("Akurasi: ", resAcc);

  // custom DOM tabel akurasi
  const tableBody = document.getElementById("tabel-akurasi-ma");
  tableBody.innerHTML = `
    <thead>
      <tr class="text-center table-dark">
        <th>Metrik</th>
        <th>Nilai</th>
      </tr>
    </thead>
    <tbody>
       <tr>
        <td class="table-light">AVG Prediksi (Rata-rata seluruh prediksi)</td>
        <td class="text-center table-info">${resAvgPrediksi}</td>
      </tr>
      <tr>
        <td class="table-light">n (Jumlah periode dalam rata-rata bergerak)</td>
        <td class="text-center table-info">${n}</td>
      </tr>
      <tr>
        <td class="table-light">MAD (Mean Absolute Deviation)</td>
        <td class="text-center table-info">${resMAD}</td>
      </tr>
      <tr>
        <td class="table-light">MSE (Mean Squared Error)</td>
        <td class="text-center table-info">${resMSE}</td>
      </tr>
      <tr>
        <td class="table-light">MAPE (Mean Absolute Precent Error)</td>
        <td class="text-center table-info">${resMAPERound}%</td>
      </tr>
      <tr>
        <td class="table-light">SE (Standard Error)</td>
        <td class="text-center table-info">${resSE}</td>
      </tr>
      <tr>
        <td>Akurasi</td>
        <td class="text-center table-primary">${resAcc}%</td>
      </tr>
    </tbody>
  `;

  tampilGrafikMA(dataMA, resAvgPrediksi, resData);
};

// fungsi grafik MA
const tampilGrafikMA = (dataMA, resAvgPrediksi, resData) => {
  const bulan = dataMA.map((data) => data.bulan);
  const prediksi = dataMA.map((data) => data.prediksi);
  const dataAktual = resData.slice(3);
  const data = dataAktual.map((data) => data.penjualan);

  // Hapus grafik sebelumnya jika ada
  const existingChart = document.getElementById("grafikMA");
  if (existingChart) {
    existingChart.remove();
  }

  // Buat elemen canvas baru untuk grafik
  const canvas = document.createElement("canvas");
  canvas.id = "grafikMA";
  canvas.classList.add("w-100");
  const chartContainer = document.getElementById("chartContainerMA");
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: bulan,
      datasets: [
        {
          label: "Prediksi MA",
          data: prediksi,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Rata-rata Prediksi MA",
          data: Array(bulan.length).fill(resAvgPrediksi),
          fill: false,
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
          borderDash: [5, 5],
        },
        {
          label: "Penjualan Aktual",
          data: data,
          fill: false,
          borderColor: "rgb(0, 181, 105)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Grafik Prediksi MA",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Bulan",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Nilai Penjualan",
          },
        },
      },
    },
  });
};

// hitung akurasi WMA 3 orde
const calAkurasiWMA3 = () => {
  const storedDataPenjualan = JSON.parse(
    sessionStorage.getItem("dataPenjualan")
  );
  const resData = storedDataPenjualan.data;
  const jumlahOrde = 3;

  // cek minimal 4 data aktual penjualan
  if (resData.length < 4) {
    swal.fire({
      title: "Error",
      text: "Perhitungan harus memiliki data aktual minimal 4 bulan",
      icon: "error",
    });
    return;
  }

  // Pembagian bobot
  const weights = [0.5, 0.3, 0.2];

  // Hitung WMA
  const dataWMA = [];

  for (let i = jumlahOrde; i < resData.length; i++) {
    let weightedSum = 0;
    for (let j = 0; j < jumlahOrde; j++) {
      weightedSum += resData[i - j - 1].penjualan * weights[j];
    }
    const prediksi = Math.round(weightedSum);

    dataWMA.push({
      bulan: resData[i].bulan,
      prediksi: parseFloat(prediksi),
    });
  }

  // Hitung Dt-Ft
  const dataDtFt = [];

  for (let i = 0; i < dataWMA.length; i++) {
    const aktual = resData[i + jumlahOrde].penjualan;
    const prediksi = dataWMA[i].prediksi;

    // Hitung selisih absolut
    const selisih = Math.abs(aktual - prediksi);

    dataDtFt.push({
      bulan: resData[i + jumlahOrde].bulan,
      dtft: selisih,
    });
  }

  // Hitung (Dt-Ft)^2
  const dataDtFtSquared = [];

  for (let i = 0; i < dataDtFt.length; i++) {
    const bulan = dataDtFt[i].bulan;
    const dtft = dataDtFt[i].dtft;
    const squared = Math.pow(dtft, 2);

    dataDtFtSquared.push({
      bulan: bulan,
      squared: squared,
    });
  }

  // (Dt-Ft)/Dt
  const dataDtFtDivDt = [];

  for (let i = 0; i < dataWMA.length; i++) {
    const bulan = dataWMA[i].bulan;
    const aktual = resData[i + jumlahOrde].penjualan;
    const prediksi = dataWMA[i].prediksi;

    const selisih = Math.abs(aktual - prediksi);

    if (aktual !== 0) {
      let hasil = selisih / aktual;
      hasil = parseFloat(hasil.toFixed(2));

      dataDtFtDivDt.push({
        bulan: bulan,
        nilai: hasil,
      });
    } else {
      dataDtFtDivDt.push({
        bulan: bulan,
        nilai: NaN,
      });
    }
  }

  const n = dataWMA.length;

  // avg seluruh prediksi WMA
  const sumPrediksi = dataWMA.reduce(
    (total, current) => total + current.prediksi,
    0
  );
  const resAvgPrediksi = Math.round(sumPrediksi / n);

  // Hitung MAD
  const sumDtFt = dataDtFt.reduce((total, current) => total + current.dtft, 0);
  const resMAD = parseFloat(sumDtFt / n).toFixed(2);

  // Hitung MSE
  const sumDtFtSquared = dataDtFtSquared.reduce(
    (total, current) => total + current.squared,
    0
  );
  const resMSE = parseFloat(sumDtFtSquared / n).toFixed(2);

  // Hitung MAPE
  const sumDtFtDivDt = dataDtFtDivDt.reduce(
    (total, current) => total + current.nilai,
    0
  );
  const hasilMAPE = parseFloat(sumDtFtDivDt / n).toFixed(4);
  const resMAPE = hasilMAPE * 100;

  // Hitung SE
  const calSE = Math.sqrt(sumDtFtSquared / (n - 2));
  const resSE = parseFloat(calSE).toFixed(2);

  // Hitung Akurasi
  const resAcc = 100 - resMAPE;

  // Tampilkan hasil
  const tableBody = document.getElementById("tabel-akurasi-wma");
  tableBody.innerHTML = `
    <thead>
      <tr class="text-center table-dark">
        <th>Metrik</th>
        <th>Nilai</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="table-light">AVG Prediksi (Rata-rata seluruh prediksi)</td>
        <td class="text-center table-info">${resAvgPrediksi}</td>
      </tr>
      <tr>
        <td class="table-light">n (Jumlah periode dalam rata-rata bergerak)</td>
        <td class="text-center table-info">${n}</td>
      </tr>
      <tr>
        <td class="table-light">MAD (Mean Absolute Deviation)</td>
        <td class="text-center table-info">${resMAD}</td>
      </tr>
      <tr>
        <td class="table-light">MSE (Mean Squared Error)</td>
        <td class="text-center table-info">${resMSE}</td>
      </tr>
      <tr>
        <td class="table-light">MAPE (Mean Absolute Percent Error)</td>
        <td class="text-center table-info">${resMAPE}%</td>
      </tr>
      <tr>
        <td class="table-light">SE (Standard Error)</td>
        <td class="text-center table-info">${resSE}</td>
      </tr>
      <tr>
        <td class="table-warning">Akurasi</td>
        <td class="text-center table-primary">${resAcc}%</td>
      </tr>
    </tbody>
  `;

  // Tampilkan grafik
  tampilGrafikWMA(dataWMA, resAvgPrediksi, resData);
};

// fungsi grafik WMA
const tampilGrafikWMA = (dataWMA, resAvgPrediksi, resData) => {
  const bulan = dataWMA.map((data) => data.bulan);
  const prediksi = dataWMA.map((data) => data.prediksi);
  const dataAktual = resData.slice(3);
  const data = dataAktual.map((data) => data.penjualan);

  // Hapus grafik sebelumnya jika ada
  const existingChart = document.getElementById("grafikWMA");
  if (existingChart) {
    existingChart.remove();
  }

  // Buat elemen canvas baru untuk grafik
  const canvas = document.createElement("canvas");
  canvas.id = "grafikWMA";
  canvas.classList.add("w-100");
  const chartContainer = document.getElementById("chartContainerWMA");
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: bulan,
      datasets: [
        {
          label: "Prediksi WMA",
          data: prediksi,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "AVG Prediksi WMA",
          data: Array(bulan.length).fill(resAvgPrediksi),
          fill: false,
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
          borderDash: [5, 5],
        },
        {
          label: "Penjualan Aktual",
          data: data,
          fill: false,
          borderColor: "rgb(0, 181, 105)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Grafik Prediksi WMA",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Bulan",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Nilai Penjualan",
          },
        },
      },
    },
  });
};

// event listener
tambahButton.addEventListener("click", addDataPenjualan);
metodeSelected.addEventListener("change", () => {
  const metode = metodeSelected.value;
  akurasiButton.disabled = false;

  // Hapus event listener sebelumnya
  akurasiButton.removeEventListener("click", calAkurasiMA3);
  akurasiButton.removeEventListener("click", calAkurasiWMA3);

  switch (metode) {
    case "MA":
      akurasiButton.setAttribute("data-bs-target", "#staticBackdropMA");
      akurasiButton.addEventListener("click", calAkurasiMA3);
      break;
    case "WMA":
      akurasiButton.setAttribute("data-bs-target", "#staticBackdropWMA");
      akurasiButton.addEventListener("click", calAkurasiWMA3);
      break;
    default:
      break;
  }
});

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

  // disable akurasi button
  metodeSelected.value = "";
  akurasiButton.disabled = true;

  // render table penjualan
  renderDataTable();
});
