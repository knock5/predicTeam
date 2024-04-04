const tambahButton = document.getElementById("tambah-data");
const akurasiButton = document.getElementById("hitung-akurasi");
const inputBulan = document.getElementById("bulan");
const inputPenjualan = document.getElementById("penjualan");

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
  const penjualan = inputPenjualan.value;

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
          penjualan: document.getElementById("modal-penjualan").value,
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

  console.log(dataMA);

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

  console.log(dataDtFt);

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

  console.log(dataDtFtSquared);

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

  console.log(dataDtFtDivDt);

  // avg seluruh prediksi
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

  console.log(resAvgPrediksi, sumDtFt, sumDtFtSquared, sumDtFtDivDt);
};

// event listener
tambahButton.addEventListener("click", addDataPenjualan);
akurasiButton.addEventListener("click", calAkurasiMA3);

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

  // render table penjualan
  renderDataTable();
});
